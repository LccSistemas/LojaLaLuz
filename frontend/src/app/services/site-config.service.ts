import { Injectable, signal, computed } from '@angular/core';

export interface HeroConfig {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  active: boolean;
}

export interface BannerSplitItem {
  imageUrl: string;
  title: string;
  subtitle: string;
  link: string;
  active: boolean;
}

export interface SaleBannerConfig {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
  active: boolean;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  active: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  active: boolean;
}

export interface StoreConfig {
  // Store Info
  storeName: string;
  storeLogo: string;
  storeEmail: string;
  storePhone: string;
  storeWhatsapp: string;
  storeAddress: string;
  storeCnpj: string;

  // Promo Bar
  promoBarText: string;
  promoBarActive: boolean;

  // Hero Section
  hero: HeroConfig;

  // Banner Split (2 banners side by side)
  bannerSplit: BannerSplitItem[];

  // Sale Banner
  saleBanner: SaleBannerConfig;

  // Features (benefits section)
  features: FeatureItem[];

  // Social Links
  socialLinks: SocialLink[];

  // Instagram Feed
  instagramUsername: string;
  instagramImages: string[];

  // Shipping
  freeShippingMinimum: number;
  defaultShippingCost: number;

  // SEO
  metaTitle: string;
  metaDescription: string;

  // Payment
  pixEnabled: boolean;
  creditCardEnabled: boolean;
  boletoEnabled: boolean;
}

const DEFAULT_CONFIG: StoreConfig = {
  storeName: 'La Luz',
  storeLogo: '',
  storeEmail: 'contato@lojalaluz.com.br',
  storePhone: '(11) 99999-9999',
  storeWhatsapp: '5511999999999',
  storeAddress: 'São Paulo, SP',
  storeCnpj: '',

  promoBarText:
    'FRETE GRÁTIS PARA COMPRAS ACIMA DE R$ 299 | PARCELE EM ATÉ 6X SEM JUROS',
  promoBarActive: true,

  hero: {
    imageUrl:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920',
    title: 'Summer Essentials',
    subtitle: 'Nova Coleção',
    buttonText: 'Comprar Agora',
    buttonLink: '/produtos',
    active: true,
  },

  bannerSplit: [
    {
      imageUrl:
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      title: 'Vestidos',
      subtitle: 'Coleção',
      link: '/produtos?category=vestidos',
      active: true,
    },
    {
      imageUrl:
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
      title: 'Conjuntos',
      subtitle: 'Coleção',
      link: '/produtos?category=conjuntos',
      active: true,
    },
  ],

  saleBanner: {
    imageUrl:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920',
    title: 'Até 50% OFF',
    subtitle: 'Aproveite',
    buttonText: 'Ver Sale',
    link: '/produtos?sale=true',
    active: true,
  },

  features: [
    {
      icon: 'shipping',
      title: 'Frete Grátis',
      description: 'Em compras acima de R$299',
      active: true,
    },
    {
      icon: 'exchange',
      title: 'Troca Grátis',
      description: 'Primeira troca por nossa conta',
      active: true,
    },
    {
      icon: 'secure',
      title: 'Compra Segura',
      description: 'Ambiente 100% protegido',
      active: true,
    },
    {
      icon: 'installment',
      title: '6x Sem Juros',
      description: 'Em todas as compras',
      active: true,
    },
  ],

  socialLinks: [
    {
      platform: 'instagram',
      url: 'https://instagram.com/lojalaluz',
      active: true,
    },
    {
      platform: 'facebook',
      url: 'https://facebook.com/lojalaluz',
      active: false,
    },
    { platform: 'tiktok', url: 'https://tiktok.com/@lojalaluz', active: false },
    { platform: 'pinterest', url: '', active: false },
  ],

  instagramUsername: 'lojalaluz',
  instagramImages: [
    'https://picsum.photos/400/400?random=1',
    'https://picsum.photos/400/400?random=2',
    'https://picsum.photos/400/400?random=3',
    'https://picsum.photos/400/400?random=4',
    'https://picsum.photos/400/400?random=5',
    'https://picsum.photos/400/400?random=6',
  ],

  freeShippingMinimum: 299,
  defaultShippingCost: 19.9,

  metaTitle: 'La Luz - Moda Feminina',
  metaDescription:
    'Descubra as últimas tendências em moda feminina. Vestidos, blusas, calças e muito mais.',

  pixEnabled: true,
  creditCardEnabled: true,
  boletoEnabled: false,
};

@Injectable({
  providedIn: 'root',
})
export class SiteConfigService {
  private configSignal = signal<StoreConfig>(this.loadConfig());

  readonly config = this.configSignal.asReadonly();

  // Computed values for easy access
  readonly storeName = computed(() => this.configSignal().storeName);
  readonly storeLogo = computed(() => this.configSignal().storeLogo);
  readonly promoBarText = computed(() => this.configSignal().promoBarText);
  readonly promoBarActive = computed(() => this.configSignal().promoBarActive);
  readonly hero = computed(() => this.configSignal().hero);
  readonly bannerSplit = computed(() => this.configSignal().bannerSplit);
  readonly saleBanner = computed(() => this.configSignal().saleBanner);
  readonly features = computed(() =>
    this.configSignal().features.filter((f) => f.active)
  );
  readonly socialLinks = computed(() =>
    this.configSignal().socialLinks.filter((s) => s.active)
  );
  readonly instagramUsername = computed(
    () => this.configSignal().instagramUsername
  );
  readonly instagramImages = computed(
    () => this.configSignal().instagramImages
  );
  readonly freeShippingMinimum = computed(
    () => this.configSignal().freeShippingMinimum
  );

  private loadConfig(): StoreConfig {
    const stored = localStorage.getItem('laluz_site_config');
    if (stored) {
      try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  }

  updateConfig(config: Partial<StoreConfig>): void {
    const newConfig = { ...this.configSignal(), ...config };
    this.configSignal.set(newConfig);
    localStorage.setItem('laluz_site_config', JSON.stringify(newConfig));
  }

  resetToDefaults(): void {
    this.configSignal.set(DEFAULT_CONFIG);
    localStorage.removeItem('laluz_site_config');
  }

  getFullConfig(): StoreConfig {
    return this.configSignal();
  }
}
