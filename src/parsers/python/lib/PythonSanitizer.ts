import { Sanitizer } from "../../IntegraphParser";

export default class PythonSanitizer implements Sanitizer {
    sanitize(comment: string): string {
        const regex = /"""([\s\S]*?)"""/g;
        const matches = comment.match(regex);

        if (matches) {
            const yamlContent = matches[0]
                .replace(/"""|@integraph/g, '')  // Remove as aspas triplas e o @integraph
                .trim();                         // Remove espaços em branco no início e no fim
            console.log({ yamlContent })
            return yamlContent;
        }

        return comment;
    }
} 