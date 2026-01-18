import { AES, enc } from "crypto-js";
const { Utf8 } = enc;

const env = process.env.NEXT_PUBLIC_ENV || "development";
const hash = process.env.NEXT_PUBLIC_HASH || "";

const encrypt = <T>(data: T): string => {
    if (env !== "prod") return data as string;
    return AES.encrypt(JSON.stringify(data), hash).toString();
};

const decrypt = <T>(data: string): T => {
    if (env !== "prod") return data as T;
    return JSON.parse(AES.decrypt(data, hash).toString(Utf8));
};

const IllegibleName = (name: string): string => {
    if (env !== "prod") return name;
    return Buffer.from(btoa(name), "utf8").toString("hex");
}

export const security = {
    AES: {
        encrypt,
        decrypt
    },
    IllegibleName
}