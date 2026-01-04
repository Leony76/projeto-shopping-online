import PageTitle from '../components/ui/PageTitle'
import AppLayout from '../layout/AppLayout'
import { HiLightBulb } from 'react-icons/hi'
import PageSectionTitle from '../components/ui/PageSectionTitle'
import { GrCodeSandbox } from 'react-icons/gr'
import CardsGrid from '../components/system/CardsGrid'
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { ProductSuggest } from '../types/SuggestProduct'
import SuggestedProductCard from '../components/system/SuggestedProductCard'
import Loading from '../components/ui/Loading'
import { useCatchError } from '../utils/ui/useCatchError'
import ConfirmDecision from '../components/ui/ConfirmDecision'
import { useToast } from '../context/ToastContext'
import { useLockYScroll } from '../utils/customHooks/useLockYScroll'

const Suggestions = () => {

  const [acceptedProductSuggestions, setAcceptedProductSuggestions] = useState<ProductSuggest[]>([]);
  const catchError = useCatchError();
  const { showToast } = useToast();
  const [openedSuggestionId, setOpenedSuggestionId] = useState<number | null | undefined>(null);

  const [selectedSuggestedProductToSell, setSelectedSuggestedProductToSell] = useState<{ amount: number; id: number | null }>({
    amount: 1,
    id: null,
  });


  const [flags, setFlags] = useState({
    isLoading: true,
    showPutToSellProductSuggestConfirm: false,
    processingState: false,
  });

  const handlePutToSellProductSuggestSubmit = async() => {

    if (selectedSuggestedProductToSell.id === null) return;

    if (flags.processingState)return;
    setFlags(prev => ({...prev, processingState: true}));

    try {
      const response = await api.post(`/add-suggested-product/${selectedSuggestedProductToSell.id}`, {
        amount: selectedSuggestedProductToSell.amount,
      });

      setAcceptedProductSuggestions(prev =>
        prev.map(suggestion =>
          suggestion.id === selectedSuggestedProductToSell.id
            ? { ...suggestion, for_sale: true }
            : suggestion
        )
      );

      setOpenedSuggestionId(null);
      setSelectedSuggestedProductToSell({ amount: 1, id: null });
      showToast(response.data.message, response.data.type);
    } catch (err:unknown) {
      catchError(err);
    } finally {
      setFlags(prev => ({...prev, 
        showPutToSellProductSuggestConfirm: false,
        processingState: false
      }))
    }
  }

  useEffect(() => {
    const getAcceptedProductSuggestions = async () => {
      try {
        const response = await api.get<{ accepted_suggestions: ProductSuggest[] }>('/accepted-suggested-products');
        setAcceptedProductSuggestions(response.data.accepted_suggestions);
      } catch (err:unknown) {
        catchError(err);
      } finally {
        setFlags(prev => ({ ...prev, isLoading: false }));
      }
    };

    getAcceptedProductSuggestions();
  }, []);

  useLockYScroll(flags.showPutToSellProductSuggestConfirm);

  return (
    <AppLayout pageSelected='suggestions'>
      {() => {
        const hasAcceptedProductSuggestions = acceptedProductSuggestions.length > 0;        

        return (
          <>
            {flags.isLoading && <Loading size={50} style="text-cyan-500 translate-[-50%] fixed top-1/2 left-1/2"/>}

            <PageTitle style='!mb-1' title={'Sugestões'} IconSize={40} icon={HiLightBulb}/>
                       
            {!flags.isLoading && hasAcceptedProductSuggestions && (
              <>
                <PageSectionTitle textSize='text-lg mt-2' title='Sugestões de produtos aceitos' icon={GrCodeSandbox}/>
                <CardsGrid gridType='productSuggests'>
                  {acceptedProductSuggestions.map((acceptedProductSuggestions) => (
                    <SuggestedProductCard 
                      key={acceptedProductSuggestions.id}
                      suggestProduct={acceptedProductSuggestions} 
                      attributes={selectedSuggestedProductToSell}
                      accepted
                      isOpen={openedSuggestionId === acceptedProductSuggestions.id}
                      onClose={() => {
                        setOpenedSuggestionId(null)
                        setSelectedSuggestedProductToSell(prev => ({...prev, amount: 1, id: null}))
                      }}
                      onToggle={() => {
                        setOpenedSuggestionId(prev => prev === acceptedProductSuggestions.id ? null : acceptedProductSuggestions.id)
                        setSelectedSuggestedProductToSell(prev => ({...prev, amount: 1, id: acceptedProductSuggestions.id ?? 0}))
                      }}
                      actions={{
                        setSelectedSuggestedProductToSell,
                        setFlags,
                      }}
                    />
                  ))}
                </CardsGrid>
              </>
            )}

            {!flags.isLoading && flags.showPutToSellProductSuggestConfirm && (
              <ConfirmDecision 
                decisionTitle={'Confirmar pôr sugestão de produto à venda'} 
                decisionDescription={`Tem certeza que deseja por ${selectedSuggestedProductToSell.amount} unidade(s) dessa sugestão de produto à venda ?`} 
                onCancel={() => setFlags(prev => ({...prev, showPutToSellProductSuggestConfirm: false}))}
                onAcceptWithoutForm={handlePutToSellProductSuggestSubmit}
                processingState={flags.processingState}
                processingLabel='Pondo'
              />
            )}
          </>
        )
      }}
    </AppLayout>
  )
}

export default Suggestions