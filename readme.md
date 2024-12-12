# Integraph
> Create Architecture diagrams from your code.

## Architecture

![Architecture](src/assets/images/arch.png)

## Install

```
npm install -g integraph
```

## Usage

Map integrations adding `@integraph` comments in your source code:

```js
class ECommerce {
    /**
     * @integraph
     * service: e-commerce
     * integrations:
     *   - service: Payment gateway
     *     edgeDirection: RL
     *     group: External APIs
     */
    processsPayment() {
        // ...
    }
}

```

Under your project root directory/repository, run the following command:

```
integraph
```

The generated diagram:

![Example 01](src/assets/images/example_01.png)

It will search for files containing `@integraph` comments and mapping all integrations, and as results it generates the following files under the directory `.integraph`:

- `diagram.js`
    - it contains the function `getDiagram` which returns the `mermaid` [architeture diagram](https://mermaid.js.org/syntax/architecture.html).
    ```
    architecture-beta
        group externalapis[External APIs]

        service ecommerce(server)[e_commerce]
        service paymentgateway(server)[Payment gateway] in externalapis

        ecommerce:R -[ecommerce__paymentgateway]- L:paymentgateway
    ```
- `integrations.js`
    - it contains the funciton `getIntegrations` which returns a json with all mappend integrations.
    ```json
    [
        {
            "startPosition":{
                "row":1,
                "column":4
            },
            "endPosition":{
                "row":8,
                "column":7
            },
            "yaml":{
                "service":"e-commerce",
                "integrations":[
                    {
                        "service":"Payment gateway",
                        "edgeDirection":"RL",
                        "group":"External APIs"
                    }
                ]
            },
            "path":"diagrams/__tests__/fixtures/example_01.ts",
            "repo":"https://github.com/danilosampaio/integraph/blob/main",
            "sourceCode":"class ECommerce { ..."
        }
    ]
    ```
- `arch.html`
    - a html page containing the diagram and a few actions such as `refresh`, `show diagram source`, and `show integrations json`. Addtionally, it makes all edges clickable, adding the ability to open the souce file where the integration is defined.

    ![Example 01](src/assets/images/example_01.gif)
- `main.css`
    - this is the css styles for the page `arch.html`
- `main.js`
    - this is the main `js` file which initialize mermaid library, render the diagram, etc.


## Service and Integration Attributes

```js
/**
 * @integraph
 * service: <string> Service name. e.g Market Place, Payment API
 * icon: <string> Icon name. e.g. server, database, logos:google-cloud, vscode-icons:file-type-mermaid
 * group: <string> Group name. e.g. External APIs, Auth Services
 * integrations: <object[]> list of integrations
 *   - service: <string> Service name. e.g Market Place, Payment API
 *     edgeDirection: <string> direction of the edge. e.g. RL, LR, TB, BT (see https://mermaid.js.org/syntax/architecture.html#edge-direction)
 *     group: <string> Group name. e.g. External APIs, Auth Services
 *     groupEdge: true (see https://mermaid.js.org/syntax/architecture.html#edges-out-of-groups)
 *     arrowedEdge: true (see https://mermaid.js.org/syntax/architecture.html#edges)
 */

```

## Supported languages

### Typescript/javascript

```js
class ECommerce {
    /**
     * @integraph
     * service: e-commerce
     * integrations:
     *   - service: Payment gateway
     *     edgeDirection: RL
     */
    processsPayment() {
        // ...
    }
}
```

### Java

```java
public class PaymentGateway {
    /**
     * @integraph
     * service: Payment gateway
     * group: External APIs
     * integrations:
     *   - service: Bank API
     *     edgeDirection: RL
     *   - service: Fraud Detection
     */
    public boolean postTransaction() {
        // ...
    }
}
```

### Python

```python
"""
@integraph
service: Fraud Detection
group: AI Agents
integrations:
  - service: Load AI Models
    group: AI Agents
"""
def detectFraud():
    print("all good!")

```

### Rust

```rust
// @integraph
// service: Load AI Models
// group: AI Agents
// integrations:
//   - service: chatgpt
//
fn loadModels() {
    // ...
}

```


# Mermaid Architecture Diagram

https://mermaid.js.org/syntax/architecture.html


## Take a look at the available icons

https://icon-sets.iconify.design/logos/

## Registered icons:

https://unpkg.com/@iconify-json/logos@1/icons.json

https://unpkg.com/@iconify-json/ix@1.2.0/icons.json

https://unpkg.com/@iconify-json/vscode-icons@1.2.3/icons.json
