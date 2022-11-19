import { usePokemons } from "../hooks/hooks";

export default function Count() {
  const queryInfo = usePokemons();

  return (
    <div>
      <h3>
        You are looking for { queryInfo.data?.length } pokemon's.
      </h3>
    </div>
  );
};