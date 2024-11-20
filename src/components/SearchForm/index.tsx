import { useForm } from "react-hook-form";
import z from "zod";
import { MagnifyingGlass } from "phosphor-react";
import { SearchFormContainer } from "./styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionsContext } from "../../contexts/TransactionsContext";
import { useContextSelector } from "use-context-selector";
import { memo } from "react";

/**
 * Por que um componente renderiza?
 * - Hooks changed (mudou estado, contexto, reducer...)
 * - Props changed (mudou propriedades)
 * - Parent changed (componente pai renderizou)
 *
 * Qual o fluxo de renderização?
 * 1. O react recria o HTML da interface daquele componente
 * 2. Compara a versão do HTML recriada com a versão do anterior
 * 3. Se mudou alguma coisa, ele reescreve o HTML na tela
 *
 * Memo:
 * 0. Hooks changed, Props changed (deep comparison)
 * 0.1 Comparar a versão anterior dos hooks e props
 * 0.2 Se mudou algo, ele vai permitir a nova renderização
 */

const SearchFormSchema = z.object({
  query: z.string(),
});

type SearchFormInputs = z.infer<typeof SearchFormSchema>;

function SearchFormComponent() {
  const fetchTransactions = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.fetchTransactions;
    }
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormInputs>({
    resolver: zodResolver(SearchFormSchema),
  });

  async function handleSearchTransactions(data: SearchFormInputs) {
    await fetchTransactions(data.query);
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
      <input
        type="text"
        placeholder="Busque por transações"
        {...register("query")}
      />

      <button type="submit" disabled={isSubmitting}>
        <MagnifyingGlass size={20} />
        Buscar
      </button>
    </SearchFormContainer>
  );
}

export const SearchForm = memo(SearchFormComponent);
