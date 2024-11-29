import { Sanitizer } from "../../IntegraphParser";

export default class JavaSanitizer implements Sanitizer {
    sanitize(comment: string): string {
        const regex = /\/\*\*([\s\S]*?)\*\//g;
        const matches = comment.match(regex);

        if (matches) {
            const yamlContent = matches[0]
                .replace(/\/\*\*|\*\//g, '')   // Remove /** e */
                .replace(/^\s*\*\s?/gm, '')    // Remove asteriscs at the begining of each line
                .replace(/\@integraph/gm, '')  // Remove @integraph key
                .trim();                       // Remove leading and trailing spaces

            return yamlContent;
        } else {
            return comment;
        }
    }
} 