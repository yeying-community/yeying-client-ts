import {ApplicationCodeEnum, ServiceCodeEnum} from "../../../src/yeying/api/common/code_pb";
import {BlockAddress} from "@yeying-community/yeying-web3";
import {ProviderCodeEnum} from "../../../src/yeying/api/llm/provider_pb";

export function getDefaultNamespace(): string {
    return "da75961a-df9e-4cca-a14a-d2a9c6ec561e"
}

export function getIdentity() {
    return {
        metadata: {
            name: "test_user",
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMzEgMjMxIj48cGF0aCBkPSJNMzMuODMsMzMuODNhMTE1LjUsMTE1LjUsMCwxLDEsMCwxNjMuMzQsMTE1LjQ5LDExNS40OSwwLDAsMSwwLTE2My4zNFoiIHN0eWxlPSJmaWxsOiMwMGE1OGM7Ii8+PHBhdGggZD0ibTExNS41IDUxLjc1YTYzLjc1IDYzLjc1IDAgMCAwLTEwLjUgMTI2LjYzdjE0LjA5YTExNS41IDExNS41IDAgMCAwLTUzLjcyOSAxOS4wMjcgMTE1LjUgMTE1LjUgMCAwIDAgMTI4LjQ2IDAgMTE1LjUgMTE1LjUgMCAwIDAtNTMuNzI5LTE5LjAyOXYtMTQuMDg0YTYzLjc1IDYzLjc1IDAgMCAwIDUzLjI1LTYyLjg4MSA2My43NSA2My43NSAwIDAgMC02My42NS02My43NSA2My43NSA2My43NSAwIDAgMC0wLjA5OTYxIDB6IiBzdHlsZT0iZmlsbDojZThiYzg2OyIvPjxwYXRoIGQ9Im0xNDEuODkgMTk1YTExNC43OSAxMTQuNzkgMCAwIDEgMzggMTYuNSAxMTUuNTUgMTE1LjU1IDAgMCAxLTEyOC40NyAwIDExNC43OSAxMTQuNzkgMCAwIDEgMzgtMTYuNWwxNS43NSAxNS43NWgyMXoiIHN0eWxlPSJmaWxsOiMwRDIwNEE7Ii8+PHBhdGggZD0ibTE0Ni40IDE5Ni4xNC0xNy40IDE3LjQ0LTEuMTcgMS4xN2gtMjQuMzRsLTEuMTgtMS4xNy0xNy40My0xNy40NGMxLjQ5LTAuNDEgMy0wLjc5IDQuNTEtMS4xNGw0LjY3LTEgMTIuNzQgMTIuNzRoMTcuNjlsMTIuNzMtMTIuNzQgNC42NyAxYzEuNTIgMC4zNSAzIDAuNzMgNC41MSAxLjE0eiIgc3R5bGU9ImZpbGw6IzAwZmZkZjsiLz48cGF0aCBkPSJtNjkuODM0IDMzLjgyNmMtOC4yMDAxLTAuMDYyNi0xNi40NDQgMi42NzUzLTIzLjE1MiA3LjcwMzgtOC41Mjk4IDYuOTg5OS0xMi4xNTkgMTkuNjEtMTIuMzI5IDMyLjY4LTAuMjA0MSAxNS40NzYgMS42MDkyIDM0Ljc1MiAxLjc0NjQgNTEuOTE1IDAuMTA0MTQgMTMuMDQ3IDAuNTM0ODUgMjUuOTg0LTIuOTE5NyAzMy45OTUtMi40OTk0IDUuODEtOS4wOTU1IDkuNjAwNi0xNi4xOTYgMTIuMzExIDcuOTU5OSAyLjgzMDEgMjUuMDA5IDIuODA5NCAzMy41OCAxLjUzOTMgMTAuOC0xLjU5IDE3LjIzOC02LjUyOTQgMTcuMTU5LTIyLjY5OS0wLjA5MTEtMTUuOTMtMS4zODk0LTI5LjIzLTEuNTU5LTQ1LjgzLTAuMzIwOC0xMS45ODMtMS41NjktMjQuMjkxIDQuOTc3NC0zMy45ODcgNC4yMTM5LTYuMTI2NSAxMC40NTItMTAuNTIxIDE3LjExNi0xMy41ODggMy45MjkyLTEuODU3NSA4LjAzODQtMy4zMDgzIDEyLjI2My00LjMyOTctNi44NzE4LTEzLjU3NC0xOC43MzItMTkuNjE4LTMwLjY4Ny0xOS43MDl6IiBzdHlsZT0iZmlsbDpub25lOyIvPjxwYXRoIGQ9Im05MC44IDc2LjI0NmMxMS45MTgtMTcuMTI1IDMxLjk5Ni0yMy4yMTggNDkuNzQzLTE3LjQ4OCAxMS44MSAzLjk0OTYgMjAuNjkyIDEzLjM4OSAyMi4zMTMgMjguMjM3IDAuNTEwNTEgNi4yMDk4IDAuNjM0MTMgMTIuNDQ1IDAuMzcwMDcgMTguNjctMC4yMzk3MyAxMS4yLTAuNzI5NDYgMjMuODItMS4wOTk1IDM0LjA4LTAuODIwMDUgMjIuNDMgMC4wNTkzIDM1LjEgMjQuNTg5IDM2LjMgOC41NjM1IDAuMzIxMjIgMTcuMTM3LTAuMjI4NDUgMjUuNTktMS42NDA1aC0wLjAxOThjLTEwLjc0LTMuMzc5OS0xNy45OC0xNS42MDktMTkuMy0yNi4yODktMS4yOS0xMC40MS0wLjYwOTgtMjMuNDMtMC43ODk4LTM4LjA5MS0wLjE3MDEtMTQuOTYgMS4wMzk4LTI5LjgxOSAwLjI4MDA4LTQyLjA4OS0xLjQxNC0yMi43NzctMTQuOTQ3LTM4LjUwNS0zNC4xMjYtNDUuMTUyLTI3LjgxMy03LjM1LTUxLjA4MyAwLjA5MS02MS42NzIgMTcuMzQzLTUuNDY5OCA4LjkxMTItNy43NDEzIDIwLjA3LTUuODc4OCAzNi4xMjF6IiBzdHlsZT0iZmlsbDojOWMwMDkyOyIvPjxwYXRoIGQ9Im03MC45NTkgOTQuOTg1aDM1LjAzMWMyLjQwODYgMWUtNSA0LjM2MTIgMS45NTIzIDQuMzYxMiA0LjM2MDZsLTIuNTg2NCAxNy41MTFjLTAuMzUxNSAyLjM3OTktMS43MjE4IDQuMzYwNi0zLjg0NTcgNC4zNjA2aC0zMC45Yy0yLjEyMzktMWUtNSAtMy44NDU3LTEuOTUyMy0zLjg0NTctNC4zNjA2bC0yLjU4NjQtMTcuNTExYzFlLTUgLTIuNDA4MiAxLjk1MjYtNC4zNjA2IDQuMzYxMi00LjM2MDZ6IiBzdHlsZT0iZmlsbDojMDAwO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6My4wMDQ1cHg7c3Ryb2tlOiMwMDA7Ii8+PHBhdGggZD0ibTE2MC4wNSA5NC45ODVoLTM1LjAzMWMtMi40MDg2IDFlLTUgLTQuMzYxMiAxLjk1MjMtNC4zNjEyIDQuMzYwNmwyLjU4NjQgMTcuNTExYzAuMzUxNDkgMi4zNzk5IDEuNzIxOCA0LjM2MDYgMy44NDU3IDQuMzYwNmgzMC45YzIuMTIzOS0xZS01IDMuODQ1Ny0xLjk1MjMgMy44NDU3LTQuMzYwNmwyLjU4NjQtMTcuNTExYy0xZS01IC0yLjQwODItMS45NTI2LTQuMzYwNi00LjM2MTItNC4zNjA2eiIgc3R5bGU9ImZpbGw6IzAwMDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjMuMDA0NXB4O3N0cm9rZTojMDAwOyIvPjxwYXRoIGQ9Im05MC42MDcgMTAyLjM1YTQuNjMzNyA0LjYzMzIgMCAxIDAgNC42ODkyIDQuNjMzNyA0LjYzMzcgNC42MzMyIDAgMCAwLTQuNjg5Mi00LjYzMzd6bTQ5LjcyIDBhNC42MzM3IDQuNjMzMiAwIDEgMCA0LjY0NDQgNC42MzM3IDQuNjMzNyA0LjYzMzIgMCAwIDAtNC42NDQ0LTQuNjMzN3oiIHN0eWxlPSJmaWxsOiMwMDA7Ii8+PHBhdGggZD0ibTcwLjY2IDk0Ljk4NWgtMTEuNzc1IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6My4wMDQ1cHg7c3Ryb2tlOiMwMDA7Ii8+PHBhdGggZD0ibTE3Mi4xMyA5NC45ODVoLTE5LjQ4NCIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjMuMDA0NXB4O3N0cm9rZTojMDAwOyIvPjxwYXRoIGQ9Im0xMDkuMzIgMTA2LjJjNC4yMDQ1LTIuNDI3IDkuMzAzNi0xLjkxMyAxMi4zNTMtMC4wMjU4IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6My4wMDQ1cHg7c3Ryb2tlOiMwMDA7Ii8+PHBhdGggZD0ibTE0OC4zMyAxMDkuNzktNS43NjI2LTguMjMyNCIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjQ7c3Ryb2tlOiNmZmY7Ii8+PHBhdGggZD0ibTE1Ni4yNyAxMDUtMi40MDMtMy40MzI4IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6NDtzdHJva2U6I2ZmZjsiLz48cGF0aCBkPSJtODIuNzQ4IDExNC4zNC04Ljk0ODktMTIuNzg0IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6NDtzdHJva2U6I2ZmZjsiLz48cGF0aCBkPSJtOTEuNDA4IDEwOS43OS01Ljc2MjYtOC4yMzI0IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6NDtzdHJva2U6I2ZmZjsiLz48cGF0aCBkPSJtOTcuMDYgMTQ0LjU5YTIwLjE1IDIwLjE1IDAgMCAwIDM2Ljg4IDQuNTN6IiBzdHlsZT0iZmlsbDojZmZmO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6Mi45OTk5cHg7c3Ryb2tlOiMwMDA7Ii8+PC9zdmc+","created":"2024-11-25T08:51:00.890Z","checkpoint":"2024-11-25T08:51:00.891Z"},"blockAddress":"xWErLHHms6xP/SVdb9MJRry2VSEbkgu6ZfnLnMjSkt4IyuWeG0oZgupNX6ve90JjxohW0oVGFeI1xos41mUhEDfSM0Xsc3n1VejASQzQeaJyt7pq5I94TyxC829lw0UGlhF74OkXYGeQ66ahmH9N3yiWcATht3CSoebsxzIplt6Shat9oCE65aGYTvIloUBk7+VTMoKvX/vBMZd01LeOeOu9TUFmyOGsRBjReOu0rDg4ffdi335oI+EjHTEjx7zG3cWLCu8ozLbbx16QE+hIEJ6ebDYhMMW8/0YPNHsR+8g2lT+IyF8tnjEocjtBvwjgd5pN0BY6FRFOpHSknA+ovRQ1zk90LAES8MuY6ZlSMKwA98UoLfU+2dSYK5+7SB4iPykTHoVe51DahHaE8LZ5HOkWWtTrUF8lzXERmfo8xyRX6tjcqQG59yzjgBGqGhc2Q3AyEwlqjYARGCS7ZLJEU7ROP/HShOAT7uwttkv9OCa0jhIEkivrf0DkTFCYE12a5sh7ASbTjMiBITAaUe/WN3RvBS91lCe17B1ypnZKgAtypk7CxLQpOEkO8f111yCblasNziQs2V7wbnfFx5Yp+ZpoGMPeEwNpgOWwSGttZEkSA1zR/OmYvXDb/L6IYM1MnIAdjaNpD4siYhUJp0DaI3+GLTsr1keJYyDr',
        },
        blockAddress: {
            "identifier": "did:ethr:0x07e4:0x035b737f93ef1a74b7fd32b62b4e313876722957ca3c705588cc3c883bf2fb568c",
            "address": "0x45C6ff6AF1Ec4E5D15668351B12A6C630a053e16",
            "privateKey": "0x2721a1f0de1656df452fa83238350d56b44403f2f02a59e840e854b61010c632",
            "publicKey": "0x035b737f93ef1a74b7fd32b62b4e313876722957ca3c705588cc3c883bf2fb568c",
            "mnemonic": {
                "phrase": "trigger happy matter office zoo chicken conduct borrow civil refuse addict lunar",
                "path": "m/44'/60'/0'/0/0",
                "locale": "en",
                "password": ""
            }
        },
        securityConfig: {"algorithm": {"name": "CIPHER_TYPE_AES_GCM_256", "iv": "PWPhFzsftCklcfgc"}}
    }
}

export function getProvider() {
    return {
        code: ProviderCodeEnum.PROVIDER_CODE_TONGYI,
        name: "test_tong_yi",
        uid: "5e8c76e2-5c56-4b00-8e04-998d1ee6885f",
        key: getProviderKey(ProviderCodeEnum.PROVIDER_CODE_TONGYI),
    }
}

export function getSession() {
    return {
        uid: "3bf7eb9a-c3e3-4412-9875-612dc58a4c4e",
        name: "test_session"
    }
}

export function getNamespace() {
    return {
        name: "test_namespace",
        uid: '96274d7e-0aae-4736-8f34-940a26f2f92a',
    }
}

export function getBlockAddress(): BlockAddress {
    return {
        privateKey: '0x1b8b419505748c88071b8d28caafa4a74bcdc4a540542e7b4514b13a3f35c96c',
        identifier: 'did:ethr:0x7e4:0x0396be3542029111627e1d08c65a740fcda7b8a341a618ebfe92bace61c0fd5506',
        publicKey: '0x0396be3542029111627e1d08c65a740fcda7b8a341a618ebfe92bace61c0fd5506',
        address: '0x6256583430f59D8d526a0a694e7d37ea1956d0AC',
        mnemonic: undefined
    }
}

export function getApplicationAddress(code: ApplicationCodeEnum) {
    switch (code) {
        case ApplicationCodeEnum.APPLICATION_CODE_MARKET:
            return process.env.YEYING_PORTAL_URL ? process.env.YEYING_PORTAL_URL as string : "http://localhost:8451"
        default:
            throw new Error(`Unknown application=${code}`)
    }
}

export function getProviderProxy(code: ServiceCodeEnum) {
    switch (code) {
        case ServiceCodeEnum.SERVICE_CODE_NODE:
            return process.env.YEYING_NODE_URL ? process.env.YEYING_NODE_URL as string : "http://localhost:8441"
        case ServiceCodeEnum.SERVICE_CODE_WAREHOUSE:
            return process.env.YEYING_WAREHOUSE_URL ? process.env.YEYING_WAREHOUSE_URL as string : "http://localhost:8641"
        case ServiceCodeEnum.SERVICE_CODE_AGENT:
            return process.env.YEYING_AGENT_URL ? process.env.YEYING_AGENT_URL as string : "http://localhost:8541"
        case ServiceCodeEnum.SERVICE_CODE_AI:
            return process.env.YEYING_AI_URL ? process.env.YEYING_AI_URL as string : "http://localhost:8741"
        default:
            throw new Error(`Unknown service provider=${code}`)
    }
}

export function getProviderKey(code: ProviderCodeEnum) {
    switch (code) {
        case ProviderCodeEnum.PROVIDER_CODE_TONGYI:
            return process.env.TONGYI_DASHSCOPE_API_KEY ? process.env.TONGYI_DASHSCOPE_API_KEY as string : ""
        default:
            throw new Error(`Unknown llm provider=${code}`)
    }
}

export function createTestFile(fileName: string, size: number): File {
    const array = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
        array[i] = i % 256; // 简单的数据填充逻辑，可以根据需要修改
    }

    return new File([array], fileName, {type: 'text/plain'});
}
