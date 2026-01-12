import solc from "solc";
import fs from "fs";
import path from "path";

interface CompilerOutput {
    contracts: {
        [fileName: string]: {
            [contractName: string]: {
                abi: any[];
                evm: {
                    bytecode: {
                        object: string;
                    };
                };
            };
        };
    };
    errors?: Array<{
        severity: string;
        formattedMessage: string;
        message: string;
    }>;
}

interface BuildOutput {
    _format: string;
    contractName: string;
    sourceName: string;
    abi: any[];
    bytecode: string;
}

export function buildContract(contractFileName: string): void {
    const contractPath = path.join(process.cwd(), "config", "solidity", contractFileName);
    const buildsPath = path.join(process.cwd(), "config", "builds");

    // Ensure builds directory exists
    if (!fs.existsSync(buildsPath)) {
        fs.mkdirSync(buildsPath, { recursive: true });
    }

    // Read the contract source code
    if (!fs.existsSync(contractPath)) {
        throw new Error(`Contract file not found: ${contractPath}`);
    }

    const source = fs.readFileSync(contractPath, "utf8");

    // Extract contract name from filename (remove .sol extension)
    const contractName = path.basename(contractFileName, ".sol");

    // Prepare the input for the Solidity compiler
    const input = {
        language: "Solidity",
        sources: {
            [contractFileName]: {
                content: source,
            },
        },
        settings: {
            outputSelection: {
                "*": {
                    "*": ["abi", "evm.bytecode", "evm.deployedBytecode"],
                },
            },
        },
    };

    // Compile the contract
    const output: CompilerOutput = JSON.parse(solc.compile(JSON.stringify(input)));

    // Check for compilation errors
    if (output.errors) {
        const errors = output.errors.filter((error: any) => error.severity === "error");
        if (errors.length > 0) {
            console.error("Compilation errors:");
            errors.forEach((error: any) => console.error(error.formattedMessage));
            throw new Error("Contract compilation failed");
        }
    }

    // Find the contract - it might have a different name than the filename
    const contracts = output.contracts[contractFileName];
    if (!contracts || Object.keys(contracts).length === 0) {
        throw new Error(`No contracts found in ${contractFileName}`);
    }

    // Get the first contract (or find by name)
    let foundContractName = contractName;
    let contract = contracts[contractName];

    if (!contract) {
        // Try to find a contract with a capitalized version of the name
        const capitalizedName = contractName.charAt(0).toUpperCase() + contractName.slice(1);
        contract = contracts[capitalizedName];
        foundContractName = capitalizedName;

        if (!contract) {
            // Just take the first contract available
            foundContractName = Object.keys(contracts)[0];
            contract = contracts[foundContractName];
        }
    }

    if (!contract) {
        throw new Error(`Contract "${contractName}" not found in compilation output`);
    }

    // Create the build output in the same format as DARK20.json
    const buildOutput: BuildOutput = {
        _format: "hh-sol-artifact-1",
        contractName: foundContractName,
        sourceName: `config/solidity/${contractFileName}`,
        abi: contract.abi,
        bytecode: `0x${contract.evm.bytecode.object}`,
    };

    // Write the output to the builds folder
    const outputPath = path.join(buildsPath, `${foundContractName}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(buildOutput, null, 4));

    console.log(`✅ Contract "${foundContractName}" built successfully!`);
    console.log(`📁 Output saved to: ${outputPath}`);
}

// Main execution if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const contractFileName = process.argv[2];

    if (!contractFileName) {
        console.error("Usage: npm run build-contract <contract-file.sol>");
        console.error("Example: npm run build-contract test-contract.sol");
        console.error("Note: Contract files should be in config/solidity/ folder");
        process.exit(1);
    }

    try {
        buildContract(contractFileName);
    } catch (error) {
        console.error("Build failed:", error.message);
        process.exit(1);
    }
}
