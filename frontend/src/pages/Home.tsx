import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Product, Collection, LookbookData, CMSSection } from '../types';
import { CampaignHero } from '../components/home/CampaignHero';
import { ScrollDrivenNarrative } from '../components/home/ScrollDrivenNarrative';
import { TypographyStatement } from '../components/home/TypographyStatement';
import { SplitPromoSection } from '../components/home/SplitPromoSection';
import { ProductTabs } from '../components/home/ProductTabs';
import { PinnedStrengthSection } from '../components/home/PinnedStrengthSection';
import { EditorialSplit } from '../components/home/EditorialSplit';
import { LookbookHotspots } from '../components/home/LookbookHotspots';
import { CuratedFeature } from '../components/home/CuratedFeature';
import { ReviewsAndJournalSection } from '../components/home/ReviewsAndJournalSection';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [lookbookData, setLookbookData] = useState<LookbookData | null>(null);
  const [cmsSections, setCmsSections] = useState<Record<string, CMSSection>>({});
  const [, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [prodList, collList, lbData, cmsData] = await Promise.all([
          api.getProducts(),
          api.getCollections(),
          api.getLookbook(),
          api.getHomepageCMS(),
        ]);
        setProducts(prodList);
        setCollections(collList);
        setLookbookData(lbData);
        setCmsSections(cmsData);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <main style={{ width: '100%', marginTop: '-64px' }}>
      {/* 1. Hero Section (Radiant Section 8) */}
      <CampaignHero cmsData={cmsSections['hero']} onNavigate={onNavigate} />

      {/* 2. Scroll-Driven Background Changes (Radiant Section 9) */}
      <ScrollDrivenNarrative onNavigate={onNavigate} />

      {/* 3. Typography Statement & Category Grid (Radiant Section 10) */}
      <TypographyStatement onNavigate={onNavigate} />

      {/* 4. Promo Bar & Split Promo (Radiant Section 11) */}
      <SplitPromoSection onNavigate={onNavigate} />

      {/* 5. Collection Carousel with Tabs & Strict 4-Column Product Grid (Radiant Sections 12 & 13) */}
      <ProductTabs products={products} collections={collections} onNavigate={onNavigate} />

      {/* 6. Featured Collection - Oxblood Section (Radiant Section 14) */}
      <PinnedStrengthSection onNavigate={onNavigate} />

      {/* 7. Category Split (Radiant Section 15) */}
      <EditorialSplit onNavigate={onNavigate} />

      {/* 8. Interactive Lookbook and Bundle (Radiant Section 16) */}
      <LookbookHotspots lookbookData={lookbookData} onNavigate={onNavigate} />

      {/* 9. Product Detail Teaser, Archive Grid, Film Teaser (Radiant Section 17) */}
      <CuratedFeature products={products} onNavigate={onNavigate} />

      {/* 10. Reviews, Journal, Stores, FAQ (Radiant Section 20) */}
      <ReviewsAndJournalSection onNavigate={onNavigate} />
    </main>
  );
};
