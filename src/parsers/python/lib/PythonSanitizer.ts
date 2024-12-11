import { Sanitizer } from "../../IntegraphParser";

export default class PythonSanitizer implements Sanitizer {
    sanitize(comment: string): string {
        const regex = /"""([\s\S]*?)"""/g;
        const matches = comment.match(regex);

        if (matches) {
            const yamlContent = matches[0]
                .replace(/"""|@integraph/g, '')  // Remove as triple quotes and @integraph
                .trim();                         // Remove spaces at the begining and at the end
            return yamlContent;
        }

        return comment;
    }
} 