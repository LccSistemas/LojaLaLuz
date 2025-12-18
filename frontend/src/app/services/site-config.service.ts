import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

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
  private http = inject(HttpClient);
  private configSignal = signal<StoreConfig>(DEFAULT_CONFIG);
  private loaded = false;

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

  constructor() {
    this.loadConfigFromAPI();
  }

  private async loadConfigFromAPI(): Promise<void> {
    if (this.loaded) return;

    try {
      const config = await firstValueFrom(
        this.http.get<StoreConfig>(`${environment.apiUrl}/site-config`)
      );
      this.configSignal.set({ ...DEFAULT_CONFIG, ...config });
      this.loaded = true;
    } catch (error) {
      console.warn('Failed to load site config from API, using defaults');
      this.configSignal.set(DEFAULT_CONFIG);
    }
  }

  async saveConfig(config: StoreConfig): Promise<void> {
    try {
      const saved = await firstValueFrom(
        this.http.put<StoreConfig>(`${environment.apiUrl}/site-config`, config)
      );
      this.configSignal.set({ ...DEFAULT_CONFIG, ...saved });
    } catch (error) {
      console.error('Failed to save site config:', error);
      throw error;
    }
  }

  updateConfig(config: Partial<StoreConfig>): void {
    const newConfig = { ...this.configSignal(), ...config };
    this.configSignal.set(newConfig);
  }

  async resetToDefaults(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.put<StoreConfig>(
          `${environment.apiUrl}/site-config`,
          DEFAULT_CONFIG
        )
      );
      this.configSignal.set(DEFAULT_CONFIG);
    } catch (error) {
      console.error('Failed to reset config:', error);
      this.configSignal.set(DEFAULT_CONFIG);
    }
  }

  getFullConfig(): StoreConfig {
    return this.configSignal();
  }

  async refresh(): Promise<void> {
    this.loaded = false;
    await this.loadConfigFromAPI();
  }
}
