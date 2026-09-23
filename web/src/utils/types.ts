import { ReactNode } from "react";

export interface Professor {
    id: number;
    name: string;
    rank: string;
    faculty: string;
    specialty?: string;
    isFaculty: boolean;
    avatar: string;
    email?: string;
    bio?: string;

    education?: {
        degree: string;
        field: string;
        university: string;
        year: string;
    }[];

    employment?: {
        position: string;
        university: string;
        year: string;
    }[];

    executive?: string[];
    researchAreas?: string[];
    resume?: string;

    stats?: {
        theses: number;
        papers: number;
        conferences: number;
        books: number;
    };

    paperScores?: {
        citations: number;
        hIndex: number;
        i10Index: number;
    };

    publications?: Array<{ title: string; year: number; journal: string }>;

    links: {
        scholar?: string;
        researchgate?: string;
        scopus?: string;
        website?: string;
    };
}

export interface CardProps {
    title?: string;
    children: ReactNode;
}

export interface InfoItemProps {
    label: string;
    value: string;
}

export interface LinkButtonProps {
    icon: ReactNode;
    text: string;
    href: string;
}

export interface StatBoxProps {
    label: string;
    value: number;
}

