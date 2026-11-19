export type ExperienceCategory = 'all' | 'alternance' | 'social' | 'event';

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  contractType: string;
  period: string;
  category: Exclude<ExperienceCategory, 'all'>;
  categoryLabel: string;
  pastelBg: string;
  summary: string;
  missions: string[];
  skills: string[];
  featured?: boolean;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  period: string;
  status: string;
  focus: string;
}

export interface SkillItem {
  name: string;
  type: 'hard' | 'soft';
  description: string;
  relatedExperienceIds: string[];
}

export const IRIS_PROFILE = {
  fullName: 'Iris Takessian',
  city: 'Paris',
  phone: '07 69 70 90 78',
  phoneHref: 'tel:+33769709078',
  email: 'takessianiris@gmail.com',
  cvPath: '/assets/aistudio/CV_2026_7fcd563c.pdf',
  headlineTitle: 'Marketing, Communication',
  headlineScript: '& Événementiel',
  seeking: 'Recherche un CDI à l’issue de son alternance',
  bio: "Passionnée par la stratégie de marque, la production et l'événementiel, je suis actuellement en Master Brand Experience & Event à Sup de Pub et alternante chargée de production chez GRANDPRIX.tv depuis septembre 2026, après avoir terminé mon alternance chez Jojo's Dough en août. Organisée et créative, je souhaite m'investir durablement en CDI sur des projets impactants.",
  highlights: [
    { value: '05', label: 'Expériences en média, marque, agence & mairie' },
    { value: 'Sup de Pub', label: 'Master Brand Experience & Event' },
    { value: '360°', label: 'Stratégie, création, event, production & social media' },
    { value: 'CDI', label: 'Disponible dès Septembre 2028' },
  ],
  hobbies: [
    {
      name: 'Équitation, Pilates & Course à pied',
      note: 'Discipline, régularité et gestion du rythme sur le long terme.',
    },
    {
      name: 'Voyage',
      note: 'Curiosité culturelle et inspiration visuelle pour les campagnes.',
    },
    {
      name: 'Contenu digital',
      note: 'Veille créative permanente sur les formats courts et éditoriaux.',
    },
  ],
};

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'grandprix',
    role: 'Alternante chargée de production',
    company: 'GRANDPRIX.tv',
    contractType: 'Alternance',
    period: 'Sept. 2026 – En cours',
    category: 'alternance',
    categoryLabel: 'Production & Médias',
    pastelBg: 'bg-pastel-lavender',
    summary:
      'Coordination de production audiovisuelle et digitale au sein du média GRANPRIX.',
    missions: [
      'Appui à la coordination éditoriale et logistique des tournages et formats vidéo',
      'Suivi opérationnel des plannings de production et lien avec les équipes créatives',
      'Participation à la valorisation des contenus et à leur diffusion multi-plateformes',
    ],
    skills: ['Gestion de projets', 'Création de contenu', 'Réseaux sociaux', 'Esprit d’équipe'],
    featured: true,
  },
  {
    id: 'jojos-dough',
    role: 'Chargée de projets marketing & communication',
    company: "Jojo's Dough",
    contractType: 'Alternance',
    period: 'Sept. 2025 – Août 2026',
    category: 'alternance',
    categoryLabel: 'Stratégie & Événementiel',
    pastelBg: 'bg-pastel-rose',
    summary:
      'Pilotage de la stratégie de marque, activation événementielle, SEO, CRM et production photo/vidéo.',
    missions: [
      'Participation à la stratégie de marque, digitale et événementielle',
      'Création (photos, vidéos…) et optimisation de contenus',
      'Suivi des KPIs (taux d’engagement, reach, conversions…)',
      'Amélioration du SEO (contenus optimisés et mots-clés ciblés)',
      'Suivi CRM et coordination des dispositifs de communication',
    ],
    skills: [
      'Stratégie',
      'Création de contenu',
      'SEO',
      'CRM',
      'Gestion de projets',
      'Réseaux sociaux',
    ],
    featured: true,
  },
  {
    id: 'soyagency',
    role: 'Community Manager',
    company: 'Soyagency',
    contractType: 'Stage',
    period: 'Nov. – Déc. 2024',
    category: 'social',
    categoryLabel: 'Social Media & BtoB',
    pastelBg: 'bg-pastel-butter',
    summary:
      'Conception de contenus visuels, vidéo et éditoriaux ainsi que supports BtoB sous Suite Adobe, Canva et CapCut.',
    missions: [
      'Création de contenus visuels, vidéo et éditoriaux',
      'Participation à la stratégie marketing et communication',
      'Conception de supports de communication BtoB',
      'Gestion quotidienne des outils : Suite Adobe, Canva et CapCut',
    ],
    skills: [
      'Community management',
      'Suite Adobe',
      'Canva',
      'CapCut',
      'Rédaction web & storytelling',
      'Stratégie',
    ],
  },
  {
    id: 'center-parcs',
    role: 'Chargée de communication',
    company: 'Center Parcs',
    contractType: 'Stage',
    period: 'Mai – Juin 2024',
    category: 'event',
    categoryLabel: 'Acquisition & Campagnes',
    pastelBg: 'bg-pastel-sage',
    summary:
      'Optimisation du tunnel d’achat, création de newsletters et suivi hebdomadaire des performances publicitaires.',
    missions: [
      'Création et envoi de newsletters',
      'Optimisation du tunnel d’achat de ventes',
      'Analyse des campagnes publicitaires',
      'Suivi des KPIs hebdomadaires',
    ],
    skills: ['CRM', 'Rédaction web & storytelling', 'Suite Office', 'Stratégie'],
  },
  {
    id: 'azay-le-rideau',
    role: 'Assistante communication',
    company: "Mairie d'Azay-Le-Rideau",
    contractType: 'Stage',
    period: 'Janv. – Févr. 2024',
    category: 'event',
    categoryLabel: 'Événementiel & Print',
    pastelBg: 'bg-pastel-lavender',
    summary:
      'Déploiement de la campagne événementielle Terre de Jeux 2024 sur supports digitaux et imprimés.',
    missions: [
      'Création et rédaction de contenus éditoriaux',
      'Création et gestion de la campagne Terre de Jeux 2024 (digital + print)',
    ],
    skills: ['Gestion de projets', 'Rédaction web & storytelling', 'Canva', 'WordPress'],
  },
];

export const FORMATIONS: EducationItem[] = [
  {
    id: 'master-supdepub',
    degree: 'Master Brand Experience & Event',
    school: 'Sup de Pub',
    period: '2026 – 2028',
    status: 'En cours',
    focus: 'Expérience de marque, conception événementielle, production et campagnes 360°.',
  },
  {
    id: 'bachelor-supdepub',
    degree: 'Bachelor Stratégie de Communication',
    school: 'Sup de Pub',
    period: '2025 – 2026',
    status: 'Obtenu',
    focus: 'Conception de campagnes 360°, positionnement de marque, événementiel et média.',
  },
  {
    id: 'bts-com',
    degree: 'BTS Communication',
    school: 'Formation initiale',
    period: '2024 – 2025',
    status: 'Obtenu',
    focus: 'Fondamentaux de la communication opérationnelle, création de supports et suivi client.',
  },
];

export const SKILLS: SkillItem[] = [
  {
    name: 'Stratégie',
    type: 'soft',
    description: 'Élaboration de stratégies de marque, digitales, BtoB et événementielles.',
    relatedExperienceIds: ['jojos-dough', 'soyagency', 'center-parcs'],
  },
  {
    name: 'Création de contenu',
    type: 'soft',
    description: 'Production photo, vidéo et éditoriale adaptée aux codes de chaque plateforme.',
    relatedExperienceIds: ['grandprix', 'jojos-dough', 'soyagency'],
  },
  {
    name: 'Community management',
    type: 'soft',
    description: 'Animation de communautés, calendrier éditorial et analyse de l’engagement.',
    relatedExperienceIds: ['soyagency', 'jojos-dough'],
  },
  {
    name: 'Gestion de projets',
    type: 'soft',
    description: 'Coordination des dispositifs de communication, prestataires et plannings.',
    relatedExperienceIds: ['grandprix', 'jojos-dough', 'azay-le-rideau'],
  },
  {
    name: 'Rédaction web & storytelling',
    type: 'soft',
    description: 'Newsletters, articles optimisés, supports BtoB et récits de marque engageants.',
    relatedExperienceIds: ['soyagency', 'center-parcs', 'azay-le-rideau'],
  },
  {
    name: 'Esprit d’équipe',
    type: 'soft',
    description: 'Collaboration fluide en agence, en production média et en équipe marketing.',
    relatedExperienceIds: ['grandprix', 'jojos-dough', 'soyagency'],
  },
  {
    name: 'Suite Adobe',
    type: 'hard',
    description: 'Photoshop et Illustrator pour la création de visuels et supports BtoB/print.',
    relatedExperienceIds: ['soyagency', 'jojos-dough'],
  },
  {
    name: 'Canva',
    type: 'hard',
    description: 'Déclinaison rapide de formats social media, présentations et supports print.',
    relatedExperienceIds: ['soyagency', 'azay-le-rideau', 'jojos-dough'],
  },
  {
    name: 'CapCut',
    type: 'hard',
    description: 'Montage dynamique de vidéos courtes (Reels, TikTok, formats éditoriaux).',
    relatedExperienceIds: ['soyagency', 'jojos-dough', 'grandprix'],
  },
  {
    name: 'SEO',
    type: 'hard',
    description: 'Optimisation de contenus, recherche de mots-clés ciblés et visibilité organique.',
    relatedExperienceIds: ['jojos-dough'],
  },
  {
    name: 'CRM',
    type: 'hard',
    description: 'Suivi de la relation client, newsletters et optimisation du tunnel d’achat.',
    relatedExperienceIds: ['jojos-dough', 'center-parcs'],
  },
  {
    name: 'WordPress',
    type: 'hard',
    description: 'Publication, mise en forme de contenus web et intégration éditoriale.',
    relatedExperienceIds: ['jojos-dough', 'azay-le-rideau'],
  },
  {
    name: 'Réseaux sociaux',
    type: 'hard',
    description: 'Suivi des KPIs (reach, engagement, conversions) et pilotage de diffusion.',
    relatedExperienceIds: ['jojos-dough', 'soyagency', 'grandprix'],
  },
  {
    name: 'Suite Office',
    type: 'hard',
    description: 'Reporting hebdomadaire des campagnes, présentations stratégiques et suivi KPIs.',
    relatedExperienceIds: ['center-parcs', 'jojos-dough'],
  },
];

export const RECRUITER_PROMPTS = [
  "Présente-moi le profil d'Iris en 30 secondes.",
  "Quelles sont ses missions chez GRANDPRIX.tv et Jojo's Dough ?",
  "Quelles compétences maîtrise-t-elle en événementiel, SEO et CRM ?",
  "Can you pitch Iris's profile in English for an international team?",
];

export const IRIS_SYSTEM_INSTRUCTION = `Tu es l'assistante personnelle officielle d'Iris Takessian. Tu parles avec une voix féminine de 22 ans, posée, confiante, calme, chaleureuse et professionnelle. Tu t'exprimes principalement en français, mais tu passes naturellement à l'anglais avec la même assurance si le recruteur ou visiteur te parle en anglais.

IDENTITÉ & OBJECTIF D'IRIS :
- Nom : Iris Takessian
- Localisation : Paris
- Téléphone : 07 69 70 90 78
- Email : takessianiris@gmail.com
- Situation actuelle : Étudiante en Master "Brand Experience & Event" à Sup de Pub (2026–2028) et alternante chargée de production chez GRANDPRIX.tv depuis septembre 2026, après avoir terminé son contrat d'alternance chez Jojo's Dough en août 2026. Elle recherche activement un CDI (disponible dès septembre 2028, à l'issue de son alternance et de son Master) dans les domaines du marketing, de la communication, de la production et de l'événementiel.

EXPÉRIENCES PROFESSIONNELLES COMPLÈTES :
1. Alternante chargée de production — GRANDPRIX.tv (Sept. 2026 – En cours) : coordination de production, suivi opérationnel des contenus et projets vidéo/digitaux.
2. Chargée de projets marketing & communication — Jojo's Dough (Alternance terminée, Sept. 2025 – Août 2026) :
   - Participation à la stratégie de marque, digitale et événementielle
   - Création (photos, vidéos...) et optimisation de contenus
   - Suivi des KPIs (taux d'engagement, reach, conversions...)
   - Amélioration du SEO (contenus optimisés / mots-clés ciblés)
   - Suivi CRM
   - Coordination des dispositifs de communication
3. Community Manager — Soyagency (Stage, Nov. – Déc. 2024) :
   - Création de contenus visuels, vidéo / éditoriaux
   - Participation à la stratégie marketing et communication
   - Conception de supports de communication BtoB
   - Gestion d'outils : Suite Adobe, Canva, CapCut
4. Chargée de communication — Center Parcs (Stage, Mai – Juin 2024) :
   - Création et envoi de newsletters
   - Optimisation du tunnel d'achat de ventes
   - Analyse des campagnes publicitaires
   - Suivi des KPIs hebdomadaires
5. Assistante communication — Mairie d'Azay-Le-Rideau (Stage, Janvier – Février 2024) :
   - Création et rédaction de contenus
   - Création et gestion de la campagne Terre de Jeux 2024 (digital + print)

FORMATIONS :
- Master "Brand Experience & Event" — Sup de Pub (En cours, 2026–2028)
- Bachelor Stratégie de Communication — Sup de Pub (Obtenu, 2025–2026)
- BTS Communication (Obtenu, 2024–2025)

COMPÉTENCES :
- Soft Skills : Stratégie, création de contenu, community management / réseaux sociaux, gestion de projets, rédaction web et storytelling, esprit d'équipe.
- Hard Skills : Canva, Suite Adobe (Photoshop, Illustrator), Suite Office, WordPress, SEO, réseaux sociaux, gestion de projets, CRM, CapCut.

CENTRES D'INTÉRÊT :
- Sport : équitation, pilates, course à pied
- Voyage
- Contenu digital

RÈGLES DE COMPORTEMENT STRICTES :
- Tu représentes Iris auprès de recruteurs, directeurs artistiques, responsables communication ou équipes RH.
- Adopte toujours un ton calme, structuré, sûr de toi, fluide et naturel (jamais robotique, jamais familier à l'excès, jamais surjoué). Ne mentionne pas l'âge ou le style de ta voix sauf si on te le demande.
- Ne invente JAMAIS d'entreprises, de diplômes ou de chiffres absents du CV d'Iris. Si on te demande un détail précis non mentionné sur son CV (comme ses prétentions salariales exactes ou une disponibilité précise au jour près), réponds avec élégance que tu peux transmettre la demande directement à Iris à l'adresse takessianiris@gmail.com ou au 07 69 70 90 78.
- En mode vocal, garde tes réponses concises, rythmées et naturelles (2 à 4 phrases percutantes par tour, sauf si le recruteur demande un développement complet).`;
