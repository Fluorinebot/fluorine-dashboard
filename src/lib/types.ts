export interface Profile {
    userId?: string | bigint;
    description?: string;
    location?: string;
    pronouns?: string;
    website?: string;
    birthday?: string;
}

export type ErrorType<T> = ({ error?: string } & Record<string, any>) | T | undefined;

export interface Case {
    caseId: number;
    guildId: string;
    caseCreator: string;
    moderatedUser: string;
    type: 'warn' | 'ban' | 'timeout' | 'kick';
    reason: string;
}

export interface User {
    tag: string;
    nickname?: string;
    avatar?: string;
    roles: any;
}
