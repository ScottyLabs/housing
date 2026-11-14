import { useSearchParams } from "react-router-dom";
import { useCampusBuildings } from "@/components/BuildingContext";
import { DEFAULT_ORIGIN_ID } from "./places";

export interface MapParams {
  originId: string;
  pickedId: string;
  query: string;
  setOriginId: (id: string) => void;
  setPickedId: (id: string) => void;
  setQuery: (query: string) => void;
}

const ORIGIN_KEY = "origin";
const PICKED_KEY = "building";
const QUERY_KEY = "q";

export default function useMapParams(): MapParams {
  const [params, setParams] = useSearchParams();
  const campusBuildings = useCampusBuildings();

  const rawOrigin = params.get(ORIGIN_KEY) ?? "";
  const known = campusBuildings.some((campus) => campus.id === rawOrigin);

  const setParam = (key: string, value: string) => {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value === "") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      },
      { replace: true },
    );
  };

  return {
    originId: known ? rawOrigin : DEFAULT_ORIGIN_ID,
    pickedId: params.get(PICKED_KEY) ?? "",
    query: params.get(QUERY_KEY) ?? "",
    setOriginId: (id) => {
      setParam(ORIGIN_KEY, id);
    },
    setPickedId: (id) => {
      setParam(PICKED_KEY, id);
    },
    setQuery: (query) => {
      setParam(QUERY_KEY, query);
    },
  };
}
