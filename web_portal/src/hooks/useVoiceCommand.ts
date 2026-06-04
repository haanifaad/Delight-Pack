import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useVoiceCommand() {
  const router = useRouter();

  const handleCommand = useCallback((transcript: string) => {
    const text = transcript.toLowerCase();
    
    // Basic NLP intent mapping
    if (text.includes('profit') || text.includes('finance')) {
      router.push('/admin/finance');
    } else if (text.includes('order') || text.includes('sales')) {
      router.push('/admin/orders');
    } else if (text.includes('inventory') || text.includes('stock')) {
      router.push('/admin/inventory');
    } else if (text.includes('dashboard') || text.includes('home')) {
      router.push('/admin');
    } else if (text.includes('catalog') || text.includes('pdf')) {
      router.push('/admin/catalog');
    } else {

    }
  }, [router]);

  return { handleCommand };
}
