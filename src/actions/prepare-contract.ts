import fs from "fs";
import path from "path";

interface BuildArtifact {
    _format?: string;
    contractName?: string;
    sourceName?: string;
    abi: Array<{
        type: string;
        name?: string;
        inputs?: Array<{
            name: string;
            type: string;
            internalType?: string;
        }>;
        outputs?: Array<{
            name: string;
            type: string;
            internalType?: string;
        }>;
        stateMutability?: string;
    }>;
    bytecode?: string;
    linkReferences?: Record<string, any>;
    deployedLinkReferences?: Record<string, any>;
}

interface ContractFunction {
    functionName: string;
    args: any[];
    amount?: number;
}

function generateDefaultArgs(inputs: any[]): any[] {
    return inputs.map((input) => {
        const type = input.type;

        // Handle arrays first
        if (type.includes("[]")) {
            return [];
        }

        // Handle basic types
        switch (type) {
            case "address":
                return "0x0000000000000000000000000000000000000000";
            case "string":
                return "";
            case "bool":
                return false;
            case "bytes":
                return "";
            case "bytes32":
                return "";
            default:
                // Handle all uint variants (uint8, uint16, uint32, uint64, uint128, uint256, etc.)
                if (type.startsWith("uint") || type.startsWith("int")) {
                    return 0;
                }
                // Handle all bytes variants (bytes1, bytes2, ..., bytes32)
                if (type.startsWith("bytes")) {
                    return "";
                }
                // Handle fixed point numbers
                if (type.startsWith("fixed") || type.startsWith("ufixed")) {
                    return 0;
                }
                // Handle tuples/structs
                if (type.startsWith("tuple")) {
                    return [];
                }
                // Default fallback
                return "";
        }
    });
}

function isViewFunction(func: any): boolean {
    return func.stateMutability === "view" || func.stateMutability === "pure" || func.constant === true;
}

function isTransactionFunction(func: any): boolean {
    return (
        func.type === "function" &&
        !isViewFunction(func) &&
        func.stateMutability !== "view" &&
        func.stateMutability !== "pure"
    );
}

function generateTransactionFunctions(abi: any[]): ContractFunction[] {
    return abi.filter(isTransactionFunction).map((func) => {
        const args = generateDefaultArgs(func.inputs || []);
        const result: ContractFunction = {
            functionName: func.name,
            args,
        };

        // Add amount for payable functions
        if (func.stateMutability === "payable") {
            result.amount = 100;
        }

        return result;
    });
}

function generateViewFunctions(abi: any[]): ContractFunction[] {
    return abi.filter(isViewFunction).map((func) => ({
        functionName: func.name,
        args: generateDefaultArgs(func.inputs || []),
    }));
}

function generateContractJs(artifact: BuildArtifact, fileName: string): string {
    // Extract contract name from artifact or fallback to filename
    const contractName = artifact.contractName || path.basename(fileName, ".json");
    const contractNameLower = contractName.toLowerCase();
    const transactions = generateTransactionFunctions(artifact.abi);
    const views = generateViewFunctions(artifact.abi);

    const transactionsCode =
        transactions.length > 0
            ? transactions
                  .map((tx) => {
                      const argsStr = JSON.stringify(tx.args);
                      if (tx.amount !== undefined) {
                          return `        {
            functionName: "${tx.functionName}",
            args: ${argsStr},
            amount: ${tx.amount},
        }`;
                      } else {
                          return `        {
            functionName: "${tx.functionName}",
            args: ${argsStr},
        }`;
                      }
                  })
                  .join(",\n")
            : "";

    const viewsCode =
        views.length > 0
            ? views
                  .map((view) => {
                      const argsStr = JSON.stringify(view.args);
                      return `        {
            functionName: "${view.functionName}",
            args: ${argsStr},
        }`;
                  })
                  .join(",\n")
            : "";

    return `import ${contractName} from "../builds/${fileName}" with { type: "json" };

export const ${contractNameLower} = {
    abi: ${contractName}.abi,
    name: "${contractName}",
    contractId: "", // Add deployed contract address here
    transactions: [${transactions.length > 0 ? "\n" + transactionsCode + "\n    " : ""}],
    views: [${views.length > 0 ? "\n" + viewsCode + "\n    " : ""}],
};
`;
}

export function prepareContract(artifactFileName: string): void {
    const artifactPath = path.join(process.cwd(), "config", "builds", artifactFileName);
    const contractsPath = path.join(process.cwd(), "config", "contracts");

    // Ensure contracts directory exists
    if (!fs.existsSync(contractsPath)) {
        fs.mkdirSync(contractsPath, { recursive: true });
    }

    // Read the artifact file
    if (!fs.existsSync(artifactPath)) {
        throw new Error(`Artifact file not found: ${artifactPath}`);
    }

    const artifact: BuildArtifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    // Generate the contract .js file
    const contractJs = generateContractJs(artifact, artifactFileName);

    // Extract contract name and create filename
    const contractName = (artifact.contractName || path.basename(artifactFileName, ".json")).toLowerCase();
    const outputPath = path.join(contractsPath, `${contractName}.js`);

    // Write the file (recreate if exists)
    fs.writeFileSync(outputPath, contractJs);

    const displayName = artifact.contractName || path.basename(artifactFileName, ".json");
    console.log(`✅ Contract "${displayName}" prepared successfully!`);
    console.log(`📁 Contract file created: ${outputPath}`);
    console.log(`📝 Remember to update the contractId with your deployed contract address`); // Show summary of generated functions
    const transactions = generateTransactionFunctions(artifact.abi);
    const views = generateViewFunctions(artifact.abi);

    if (transactions.length > 0) {
        console.log(`🔄 Generated ${transactions.length} transaction function(s):`);
        transactions.forEach((tx, i) => console.log(`   ${i}: ${tx.functionName}`));
    }

    if (views.length > 0) {
        console.log(`👁️  Generated ${views.length} view function(s):`);
        views.forEach((view, i) => console.log(`   ${i + transactions.length}: ${view.functionName}`));
    }
}

// Main execution if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const artifactFileName = process.argv[2];

    if (!artifactFileName) {
        console.error("Usage: npm run prepare-contract <artifact-file.json>");
        console.error("Example: npm run prepare-contract TestContract.json");
        console.error("Note: Artifact files should be in config/builds/ folder");
        process.exit(1);
    }

    try {
        prepareContract(artifactFileName);
    } catch (error) {
        console.error("❌ Preparation failed:", error.message);
        process.exit(1);
    }
}
