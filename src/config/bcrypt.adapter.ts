import { compare, genSalt, hashSync } from 'bcryptjs';


export const bcryptAdapter = {

    hash: async (password: string) => {
        const salt = await genSalt();
        return hashSync(password, salt);
    },
    compare: (password: string, hashedPassword: string) => {
        return compare(password, hashedPassword);
    }

}