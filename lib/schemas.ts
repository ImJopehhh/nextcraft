import { z } from "zod";

export const loginSchema = z.object({
    identifier: z.string().min(1, "Email atau username wajib diisi"),
    password: z.string().min(1, "Password wajib diisi"),
    rememberMe: z.boolean().optional(),
});

export const homeContentSchema = z.object({
    heroBadge: z.string().min(1),
    heroTitle: z.string().min(1),
    heroDescription: z.string().min(1),
    heroBtnPrimary: z.string().min(1),
    heroBtnSecondary: z.string().min(1),
    aboutSubtitle: z.string().min(1),
    aboutTitle: z.string().min(1),
    aboutDescription: z.string().min(1),
    aboutImage: z.string().url("URL gambar tidak valid"),
    featuresTitle: z.string().min(1),
    featuresSubtitle: z.string().min(1),
    featuresList: z.array(z.object({
        icon: z.string(),
        title: z.string(),
        desc: z.string(),
    })),
    teamTitle: z.string().min(1),
    teamSubtitle: z.string().min(1),
    teamList: z.array(z.object({
        name: z.string(),
        role: z.string(),
        image: z.string().url("URL gambar tidak valid"),
    })),
});
