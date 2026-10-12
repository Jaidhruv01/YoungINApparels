import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Product, Collection, LookbookData, CMSSection } from '../types';
import { StoryCircles } from '../components/home/StoryCircles';
import { CampaignHero } from '../components/home/CampaignHero';
import { ProductTabs } from '../components/home/ProductTabs';
import { LookbookHotspots } from '../components/home/LookbookHotspots';
import { EditorialSplit } from '../components/home/EditorialSplit';
import { CuratedFeature } from '../components/home/CuratedFeature';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [lookbookData, setLookbookData] = useState<LookbookData | null>(null);
  const [cmsSections, setCmsSections] = useState<Record<string, CMSSection>>({});
  const [loading, setLoading] = useState(true);

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
    <main>
      {/* 1. Collection Story Circles */}
      <StoryCircles collections={collections} onNavigate={onNavigate} />

      {/* 2. Campaign Hero Banner */}
      <CampaignHero cmsData={cmsSections['hero']} onNavigate={onNavigate} />

      {/* 3. Product Discovery Tabs */}
      <ProductTabs products={products} onNavigate={onNavigate} />

      {/* 4. Shoppable Lookbook Hotspots */}
      <LookbookHotspots lookbookData={lookbookData} onNavigate={onNavigate} />

      {/* 5. Editorial Split Section */}
      <EditorialSplit cmsData={cmsSections['editorial_split']} onNavigate={onNavigate} />

      {/* 6. Curated Capsule Feature */}
      <CuratedFeature products={products} onNavigate={onNavigate} />
    </main>
  );
};
