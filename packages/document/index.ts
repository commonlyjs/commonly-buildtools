import { Profiler } from "inspector"
import * as path from "path"
import * as fs from "fs"
import {
    ArrowFunction,
    createProgram,
    Diagnostic,
    findConfigFile,
    getParsedCommandLineOfConfigFile,
    Node,
    ParseConfigFileHost,
    Symbol,
    SymbolFlags,
    SyntaxKind,
    sys,
    TypeChecker, TypeReference,
    VariableDeclaration
} from "typescript"


interface Member {
    name: string
    description: string
    since: string
    remarks: string[]
    metadata: {
        source: string
        specification: string
    }
    signature: {
        typeparameters: {}[]
        parameters: {}[]
        returnValue: {}
    }
    examples: string[]
}



const configPath = findConfigFile(process.cwd(), sys.fileExists)
const host: ParseConfigFileHost = {
    ...sys,
    onUnRecoverableConfigFileDiagnostic: (diagnostic: Diagnostic) => undefined
}


// const walk = (checker: TypeChecker, node: Node) => {
//     switch (node.kind) {
//         case SyntaxKind.Identifier:
//             // const identifier = node as Identifier
//             // const x = checker.getSymbolsInScope(identifier, SymbolFlags.ExportValue)
//             // console.log(x)
//             break
//         case SyntaxKind.SourceFile:
//             // const x = node as SourceFile
//             // const exported = checker.getSymbolsInScope(node, SymbolFlags.ModuleExports)
//             // const symbol = checker.getSymbolAtLocation(node)
//             // console.log(x.symbol)
//             break
//         case SyntaxKind.ExportAssignment: {
//             const thisNode = node as ExportAssignment
//             console.log(thisNode.expression)
//
//             // if () {
//
//             // }
//
//             break
//         }
//         case SyntaxKind.ArrowFunction:
//             // console.log(node)
//             break
//         case SyntaxKind.FunctionExpression:
//         case SyntaxKind.FunctionDeclaration:
//         case SyntaxKind.VariableDeclaration:
//             // console.log(node)
//             break
//         default:
//             break
//     }
//
//     node.getChildren()
//         .map(child => walk(checker, child))
// }


const walk3 = (checker: TypeChecker, node: Node, symbol: Symbol) => {
    console.log(SyntaxKind[node.kind])
}

const walk2 = (checker: TypeChecker, node: Node, symbol: Symbol) => {
    const member: any = {
        name: null,
        since: null,
        remarks: [],
        signature: {
            parameters: [],
            typeparameters: [],
            returnValue: {
                type: null,
                description: null
            }
        },
        examples: [],
        metadata: {
            source: null,
            specification: null
        },
    }
    // const dictionary = []

    switch (node.kind) {
        case SyntaxKind.VariableDeclaration: {
            const thisNode = node as VariableDeclaration
            member.name = thisNode.name.getText()
            member.description = symbol.getDocumentationComment(checker)[0].text

            if (thisNode.initializer && thisNode.initializer.kind === SyntaxKind.ArrowFunction) {
                const thatNode: ArrowFunction = thisNode.initializer as ArrowFunction
                if (thatNode.type) {
                    const typeNode = thatNode.type as any
                    switch (thatNode.type.kind) {
                        case SyntaxKind.TypeReference:
                            member.signature.returnValue.type = typeNode.typeName.escapedText
                            break
                        case SyntaxKind.BooleanKeyword:
                        case SyntaxKind.TypePredicate:
                            member.signature.returnValue.type = "boolean"
                            break
                        case SyntaxKind.NumberKeyword:
                            member.signature.returnValue.type = "number"
                            break
                        case SyntaxKind.UndefinedKeyword:
                            member.signature.returnValue.type = "undefined"
                            break
                        case SyntaxKind.NullKeyword:
                            member.signature.returnValue.type = "null"
                            break
                        case SyntaxKind.StringKeyword:
                            member.signature.returnValue.type = "string"
                            break
                        case SyntaxKind.SymbolKeyword:
                            member.signature.returnValue.type = "symbol"
                            break
                        default:
                            break
                    }
                }

                if (thatNode.typeParameters) {
                    for (const typeparameter of thatNode.typeParameters) {
                        const _typeparameter = {
                            name: typeparameter.name.escapedText,
                            defaultValue: null,
                            extends: null
                        }
                        // console.log(typeparameter)
                        member.signature.typeparameters.push(_typeparameter)
                    }
                }

                for (const parameter of thatNode.parameters) {
                    const _parameter: any = {
                        name: parameter.name.getText()
                    }

                    if (parameter.type) {
                        // console.log(((parameter.type) as any).typeName)
                        // console.log(parameter.initializer)
                        if ((parameter.type as any).typeName) {
                            _parameter.type = ((parameter.type as any).typeName as any).escapedText
                            if ((parameter.type as any).typeArguments) {
                                // console.log((parameter.type as any).typeArguments)
                                _parameter.type += `<${(parameter.type as any).typeArguments.map((x: any) => x.typeName.escapedText).join(", ")}>`
                            }
                        }
                    }
                    if (parameter.initializer) {
                        _parameter.defaultValue = (parameter.initializer as any).text
                    }
                    member.signature.parameters.push(_parameter)
                }
            }


            for (const jsDocTag of symbol.getJsDocTags()) {
                switch (jsDocTag.name) {
                    case "since":
                        // dictionary.push({ name: "since", value: jsDocTag.text || null })
                        member.since = jsDocTag.text || null
                        break
                    case "remark":
                        // dictionary.push({ name: "remark", value: jsDocTag.text || null })
                        member.remarks.push(jsDocTag.text || null)
                        break
                    case "example":
                        // dictionary.push({ name: "example", value: jsDocTag.text ? `${jsDocTag.text}@commonly` : null })
                        member.examples.push(jsDocTag.text ? `${jsDocTag.text}@commonly`.slice(4) : null)
                        break
                    case "commonly": {
                        // const example = dictionary[dictionary.length - 1]
                        // if (example.value && jsDocTag.text) {
                        //     dictionary[dictionary.length - 1].value += jsDocTag.text
                        // }
                        if(jsDocTag.text && member.examples[member.examples.length - 1]) {
                            member.examples[member.examples.length - 1] += jsDocTag.text.slice(0, -3)
                        }
                        break
                    }
                    case "param": {
                        const [ name = null, description = null ] = (jsDocTag.text || "").split(" - ")
                        // dictionary.push({ name: "parameters.name", value: name })
                        // dictionary.push({ name: "parameters.description", value: description })
                        const parameter = member.signature.parameters.find((parameter: any) => parameter.name === name)
                        parameter.description = description
                        break
                    }
                    case "returns":
                        // dictionary.push({ name: "signature.returnValue.description", value: jsDocTag.text || null })
                        member.signature.returnValue.description = jsDocTag.text || null
                        break
                    case "typeparam": {
                        const [ name = null, description = null ] = (jsDocTag.text || "").split(" - ")
                        // dictionary.push({ name: "parameters.name", value: name })
                        // dictionary.push({ name: "parameters.description", value: description })
                        const parameter = member.signature.typeparameters.find((parameter: any) => parameter.name === name)
                        parameter.description = description
                        break
                    }
                    default:
                        break
                }
            }



            break
        }
        default:
            // console.log(SyntaxKind[node.kind])
            break
    }



    return member
}

const [ outDir = "" ] = process.argv.slice(2)
if (configPath) {
    const parsedCmd = getParsedCommandLineOfConfigFile(configPath, {}, host)
    const pkg = require(path.join(process.cwd(), "./package.json"))

    if (parsedCmd) {
        const { options, fileNames } = parsedCmd
        const program = createProgram(fileNames, options)
        const checker = program.getTypeChecker()
        const mainFile = program.getSourceFiles()
            .filter(sourceFile => fileNames.includes(sourceFile.fileName))
            .find(sourceFile => path.basename(sourceFile.fileName).includes(path.basename(pkg.main, "js")))

        if (mainFile) {
            const symbol = checker.getSymbolAtLocation(mainFile)
            if (symbol && symbol.exports) {
                const members: Member[] = [];
                symbol.exports.forEach(exported => {
                    if (exported.flags & SymbolFlags.Alias) {
                        const aliasedSymbol = checker.getAliasedSymbol(exported)
                        const node = aliasedSymbol.valueDeclaration

                        members.push(walk2(checker, node, aliasedSymbol))

                    }
                })
                const dir = path.join(process.cwd(), outDir)
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir)
                }
                fs.writeFileSync(path.join(dir, "members.json"), JSON.stringify(members, null, 2))
            }
        }

        // const sourceFiles = program.getSourceFiles()
        //     .filter(sourceFile => fileNames.includes(sourceFile.fileName))

        // if (options.target) {
        //     for (const sourceFile of sourceFiles) {
        //         // walk(checker, sourceFile)
        //
        //         const symbol = checker.getSymbolAtLocation(sourceFile)
        //         if (symbol && symbol.exports) {
        //         //     console.log(symbol.exports.get("default" as __String))
        //         //     // if (symbol.flags & SymbolFlags.Alias) {
        //         //     //     const x = checker.getAliasedSymbol(symbol)
        //         //     //     console.log(x)
        //         //     // }
        //         //     // const exported = checker.getExportsOfModule(symbol)
        //         //     //     .find(exported => exported.escapedName === "default")
        //         //     // if (exported) {
        //         //     //     // console.log(exported)
        //         //     //     // walk(checker, sourceFile)
        //         //     // }
        //         // }
        //     }
        // }
    }
}
