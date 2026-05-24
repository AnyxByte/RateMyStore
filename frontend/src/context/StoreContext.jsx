import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import API from "../services/api";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  const fetchStoreFeed = useCallback(async () => {
    try {
      setLoading(true);

      const params = {};
      if (searchName.trim()) params.name = searchName;
      if (searchAddress.trim()) params.address = searchAddress;

      const response = await API.get("/store/feed", { params });
      setStores(response.data.stores);
    } catch (err) {
      console.error("Failed to load store grid context feed:", err);
    } finally {
      setLoading(false);
    }
  }, [searchName, searchAddress]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStoreFeed();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [fetchStoreFeed]);

  const submitStoreRating = async (storeId, ratingValue) => {
    try {
      await API.post("/store/rate", { storeId, rating: ratingValue });
      await fetchStoreFeed();
      return { success: true };
    } catch (err) {
      console.error("Rating submission error:", err.response?.data);
      return {
        success: false,
        error: err.response?.data?.error || "Submission failed",
      };
    }
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        loading,
        searchName,
        setSearchName,
        searchAddress,
        setSearchAddress,
        refreshFeed: fetchStoreFeed,
        submitStoreRating,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStores = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error(
      "useStores must be executed within an authorized StoreProvider shell container.",
    );
  }
  return context;
};
