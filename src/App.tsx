import React, { useEffect, useState } from "react";

// components
import SubmitButton from "./components/SubmitButton";
import UrlInput from "./components/UrlInput";
import SearchInput from "./components/SearchInput";

// utlils
import UrlShortener from "./utils/url-shortener";
import { APP_STORAGE_KEY } from "./utils/app-const";
import { UrlList } from "./components/UrlList";

// types
import { UrlItem } from "./types";

// styles
import "./App.scss";

function App() {
  const shortener = new UrlShortener();
  const [savedUrls, setSavedUrls] = useState<Array<UrlItem>>([]);
  const [searchedUrls, setSearchedUrls] = useState<Array<UrlItem>>([]);
  const [searchInputValue, setSearchInputValue] = useState("");

  // handle set urls to local state
  useEffect(() => {
    const existingURLs = getSavedUrlsFromLocalStorage();
    setSavedUrls(existingURLs);
  }, []);

  // handle url search
  // TODO: implement debounding for API calls
  useEffect(() => {
    if (searchInputValue) {
      const searchText = searchInputValue?.toLocaleLowerCase().trim();
      const mutatedSearchList = savedUrls?.filter(
        (url: UrlItem) =>
          url?.shortUrl?.toLocaleLowerCase()?.includes(searchText) ||
          url?.userUrl?.toLocaleLowerCase()?.includes(searchText)
      );
      setSearchedUrls(mutatedSearchList);
    }

    if (!searchInputValue) setSearchedUrls([]);
  }, [searchInputValue, savedUrls]);

  const saveUrlToLocalStore = (urlData: UrlItem) => {
    const existingURLs = getSavedUrlsFromLocalStorage();

    const upatedURLs = [...existingURLs, urlData];

    updateUrlsStorage(upatedURLs);
  };

  const handleShortenUrl = (userInput: string) => {
    if (userInput) {
      const shortUrl = shortener.shortenUrl(userInput);

      // save shortened url
      saveUrlToLocalStore({
        userUrl: userInput,
        shortUrl: shortUrl,
        id: shortener.generateShortCode(),
      });
    }
  };

  const handleShowOriginalUrl = (userInput: string) => {
    const foundUrl = savedUrls.filter(
      (savedUrl: any) => savedUrl?.shortUrl === userInput
    )[0];

    alert(foundUrl?.userUrl || `Sorry, we can't find the original URL :)`);
  };

  const updateUrlsStorage = (upatedURLs: Array<UrlItem>) => {
    setSavedUrls(upatedURLs);
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(upatedURLs));
  };

  const handleDeleteUrl = (urlData: UrlItem) => {
    const userConsent = window.confirm("Are you sure you want delete this");

    if (userConsent) {
      const existingURLs = getSavedUrlsFromLocalStorage();

      const upatedURLs = existingURLs.filter(
        (url: UrlItem) => !(url?.shortUrl === urlData?.shortUrl)
      );

      updateUrlsStorage(upatedURLs);
    }
  };

  const getSavedUrlsFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem(APP_STORAGE_KEY) || "[]");
  };

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e?.target?.value?.trim());
  };

  const showMainUrlList =
    !searchInputValue && !searchedUrls?.length && !!savedUrls?.length;

  const showSearchUrlList = searchInputValue && !!searchedUrls?.length;

  const showSearchEmptyState = searchInputValue && !searchedUrls?.length;

  return (
    <div id="app">
      <UrlInput
        renderButton={(showShortenUrlButton, userInput, handleResetForm) => (
          <SubmitButton
            showShortenUrlButton={showShortenUrlButton}
            handleShortenUrl={() => {
              handleShortenUrl(userInput);
              handleResetForm();
            }}
            handleShowOriginalUrl={() => handleShowOriginalUrl(userInput)}
          />
        )}
      />

      {(!!savedUrls?.length || !!searchedUrls?.length) && (
        <SearchInput
          onChange={handleSearchTextChange}
          value={searchInputValue}
        />
      )}

      {/* Render List Without Search Data */}
      {showMainUrlList && (
        <>
          <UrlList.List>
            {savedUrls?.map((savedUrl: UrlItem, index: number) => (
              <UrlList.Item
                key={savedUrl?.id}
                itemData={savedUrl}
                onDelete={handleDeleteUrl}
              />
            ))}
          </UrlList.List>
        </>
      )}

      {/* Render List With Search Data */}
      {showSearchUrlList && (
        <UrlList.List>
          {searchedUrls?.map((savedUrl: UrlItem, index: number) => (
            <UrlList.Item
              key={savedUrl?.id}
              itemData={savedUrl}
              onDelete={handleDeleteUrl}
            />
          ))}
        </UrlList.List>
      )}

      {showSearchEmptyState && (
        <div className="empty-search-state">
          <p>No URL found</p>
        </div>
      )}
    </div>
  );
}

export default App;
