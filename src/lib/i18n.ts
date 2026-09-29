export type Locale = 'en' | 'es' | 'ca';

export const supportedLocales: Locale[] = ['en', 'es', 'ca'];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  ca: 'Català',
};

export const dictionaries = {
  en: {
    nav: { portfolio: 'Portfolio', about: 'About', awards: 'Awards & Exhibitions', contact: 'Contact' },
    hero: { available: 'Barcelona, Spain & Cairo, Egypt · Available worldwide', travel: 'TRAVEL PHOTOGRAPHER', commercial: 'FREELANCE PHOTOGRAPHER', story: 'The right moment, the real story', featured: 'Featured story' },
    home: { explore: 'Explore More', together: "Let's Work Together", response: 'RESPONSE WITHIN 24 HOURS' },
    genre: { welcome: 'Welcome', looking: 'You are looking for', choose: 'Choose a genre', photographer: 'photographer.', status: 'Select a portfolio genre to continue', intro: "Hello, I'm <strong>Fareed</strong>, an <strong>award-winning professional photographer</strong> with <strong>over 5 years of experience</strong>, based between <strong>Barcelona, Spain</strong>, and <strong>Cairo, Egypt</strong>, available worldwide." },
    recognition: { awards: 'Awards & Recognition', achievements: 'Recent Achievements', exhibitions: 'Exhibitions', shows: 'Recent Shows & Venues', loading: 'Loading awards and exhibitions...', empty: 'No awards or exhibitions to display yet.' },
    clients: { title: 'Previous Clients' },
    pages: { about: 'About Me', contact: 'Let\'s Connect', portfolio: 'Portfolio', portfolioAll: 'All', awards: 'Awards & Exhibitions', exhibitions: 'Exhibitions', exhibitionsSoon: 'Exhibitions content coming soon.' },
    contact: { intro: 'Ready to work together? Choose your preferred way to get in touch.', response: 'Usually within 24 hours', email: 'Email', whatsapp: 'WhatsApp', phone: 'Phone', instagram: 'Instagram', facebook: 'Facebook', emailDescription: 'Drop me a line', whatsappDescription: 'Quick message', phoneDescription: 'Call directly', instagramDescription: 'Follow my work', facebookDescription: 'Connect with me' },
    accessibility: { openMenu: 'Open navigation menu', chooseGenre: 'Choose a portfolio genre', primary: 'Primary navigation', mobile: 'Mobile navigation' },
  },
  es: {
    nav: { portfolio: 'Portafolio', about: 'Sobre mí', awards: 'Premios y exposiciones', contact: 'Contacto' },
    hero: { available: 'Barcelona, España y El Cairo, Egipto · Disponible en todo el mundo', travel: 'FOTÓGRAFO DE VIAJES', commercial: 'FOTÓGRAFO COMERCIAL', story: 'El momento adecuado, la historia real', featured: 'Historia destacada' },
    home: { explore: 'Explorar más', together: 'Trabajemos juntos', response: 'RESPUESTA EN 24 HORAS' },
    genre: { welcome: 'Bienvenido', looking: 'Estás buscando', choose: 'Elige un género', photographer: 'fotógrafo.', status: 'Selecciona un género para continuar', intro: 'Hola, soy <strong>Fareed</strong>, un <strong>fotógrafo profesional galardonado</strong> con <strong>más de 5 años de experiencia</strong>, entre <strong>Barcelona, España</strong> y <strong>El Cairo, Egipto</strong>, disponible en todo el mundo.' },
    recognition: { awards: 'Premios y reconocimientos', achievements: 'Logros recientes', exhibitions: 'Exposiciones', shows: 'Exposiciones y espacios recientes', loading: 'Cargando premios y exposiciones...', empty: 'Todavía no hay premios ni exposiciones que mostrar.' },
    clients: { title: 'Clientes anteriores' },
    pages: { about: 'Sobre mí', contact: 'Conectemos', portfolio: 'Portafolio', portfolioAll: 'Todo', awards: 'Premios y exposiciones', exhibitions: 'Exposiciones', exhibitionsSoon: 'El contenido de exposiciones estará disponible próximamente.' },
    contact: { intro: '¿Listo para trabajar juntos? Elige tu forma preferida de contactar.', response: 'Normalmente en 24 horas', email: 'Correo electrónico', whatsapp: 'WhatsApp', phone: 'Teléfono', instagram: 'Instagram', facebook: 'Facebook', emailDescription: 'Escríbeme', whatsappDescription: 'Mensaje rápido', phoneDescription: 'Llama directamente', instagramDescription: 'Sigue mi trabajo', facebookDescription: 'Conecta conmigo' },
    accessibility: { openMenu: 'Abrir menú de navegación', chooseGenre: 'Elige un género fotográfico', primary: 'Navegación principal', mobile: 'Navegación móvil' },
  },
  ca: {
    nav: { portfolio: 'Portafoli', about: 'Sobre mi', awards: 'Premis i exposicions', contact: 'Contacte' },
    hero: { available: 'Barcelona, Espanya i el Caire, Egipte · Disponible arreu del món', travel: 'FOTÒGRAF DE VIATGES', commercial: 'FOTÒGRAF COMERCIAL', story: 'El moment adequat, la història real', featured: 'Història destacada' },
    home: { explore: 'Explora més', together: 'Treballem junts', response: 'RESPOSTA EN 24 HORES' },
    genre: { welcome: 'Benvingut', looking: 'Estàs buscant', choose: 'Tria un gènere', photographer: 'fotògraf.', status: 'Selecciona un gènere per continuar', intro: 'Hola, soc <strong>Fareed</strong>, un <strong>fotògraf professional guardonat</strong> amb <strong>més de 5 anys d’experiència</strong>, entre <strong>Barcelona, Espanya</strong> i <strong>el Caire, Egipte</strong>, disponible arreu del món.' },
    recognition: { awards: 'Premis i reconeixements', achievements: 'Èxits recents', exhibitions: 'Exposicions', shows: 'Exposicions i espais recents', loading: 'Carregant premis i exposicions...', empty: 'Encara no hi ha premis ni exposicions per mostrar.' },
    clients: { title: 'Clients anteriors' },
    pages: { about: 'Sobre mi', contact: 'Posem-nos en contacte', portfolio: 'Portafoli', portfolioAll: 'Tot', awards: 'Premis i exposicions', exhibitions: 'Exposicions', exhibitionsSoon: 'El contingut d’exposicions estarà disponible aviat.' },
    contact: { intro: 'Preparat per treballar junts? Tria la teva manera preferida de contactar.', response: 'Normalment en 24 hores', email: 'Correu electrònic', whatsapp: 'WhatsApp', phone: 'Telèfon', instagram: 'Instagram', facebook: 'Facebook', emailDescription: 'Escriu-me', whatsappDescription: 'Missatge ràpid', phoneDescription: 'Truca directament', instagramDescription: 'Segueix la meva feina', facebookDescription: 'Connecta amb mi' },
    accessibility: { openMenu: 'Obre el menú de navegació', chooseGenre: 'Tria un gènere fotogràfic', primary: 'Navegació principal', mobile: 'Navegació mòbil' },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'es' || value === 'ca';
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}