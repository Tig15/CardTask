import React, { useState, useEffect, useRef } from 'react';


const CardListing = () => {
  const [activeTab, setActiveTab] = useState('Your');
  const [cards, setCards] = useState([]);
  const [originalCards, setOriginalCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [generatedCardIds, setGeneratedCardIds] = useState([]);
  const containerRef = useRef(null);
  const observer = useRef(null);

  const generateMoreCards = () => {
    // Generate unique card names
    const names = [];
    for (let i = 0; i < 10; i++) {
      let name;
      if (i % 2 === 0) {
        name = generateBurnerName();
      } else {
        name = generateSubscriptionName();
      }
      names.push(name);
    }

    // Create card objects with unique names
    const newCards = names.map((name) => {
      const cardId = generateCardId();
      return {
        id: cardId,
        name: name,
        type: generateCardType(cardId),
        expiry: generateExpiryDate(),
        limit: generateLimit(),
        owner_id: generateOwnerId(),
      };
    });

    // Update generated card ids
    setGeneratedCardIds((prevIds) => [...prevIds, ...newCards.map((card) => card.id)]);

    return newCards;
  };

  const generateCardId = () => {
    let cardId;
    do {
      cardId = Math.floor(Math.random() * 1000) + 1;
    } while (generatedCardIds.includes(cardId));
    return cardId;
  };

  const generateBurnerName = () => {
    const names = ['John', 'Emily', 'Michael', 'Emma', 'Daniel'];
    return names[Math.floor(Math.random() * names.length)];
  };

  const generateSubscriptionName = () => {
    const names = ['Sarah', 'David', 'Olivia', 'Jacob', 'Sophia'];
    return names[Math.floor(Math.random() * names.length)];
  };

  const generateCardType = (cardId) => {
    return cardId % 2 === 0 ? 'burner' : 'subscription';
  };

  const generateExpiryDate = () => {
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
    return expiryDate.toLocaleDateString('en-US');
  };

  const generateLimit = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  const generateOwnerId = () => {
    return Math.floor(Math.random() * 1000) + 1;
  };

  const fetchCards = () => {
    setLoading(true);

    // Simulating API call
    setTimeout(() => {
      const newCards = generateMoreCards();
      setCards((prevCards) => [...prevCards, ...newCards]);
      setOriginalCards((prevCards) => [...prevCards, ...newCards]);
      setCurrentPage((prevPage) => prevPage + 1);
      setLoading(false);

      if (currentPage === 10) {
        setHasMore(false);
      }
    }, 1000);
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    });

    if (containerRef.current) {
      observer.current.observe(containerRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading && hasMore) {
      fetchCards();
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCards([]);
    setCurrentPage(1);
    setHasMore(true);
    setLoading(true);
    setGeneratedCardIds([]);
    setTimeout(() => {
      fetchCards();
    }, 1000);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const filteredCards = originalCards.filter((card) => {
      return card.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setCards(filteredCards);
  };

  const handleFilterChange = (event) => {
    const selectedType = event.target.value;
    setFilterType(selectedType);
    setCards([]);
    setCurrentPage(1);
    setHasMore(true);
    setLoading(true);
    setGeneratedCardIds([]);
    setTimeout(() => {
      fetchCards();
    }, 1000);
  };

  const filteredCards = cards.filter((card) => {
    if (filterType && card.type !== filterType) {
      return false;
    }
    return true;
  });

  return (
    <div className="container">
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'Your' ? 'active' : ''}`}
          onClick={() => handleTabClick('Your')}
        >
          Your Cards
        </div>
        <div
          className={`tab ${activeTab === 'All' ? 'active' : ''}`}
          onClick={() => handleTabClick('All')}
        >
          All Cards
        </div>
        <div
          className={`tab ${activeTab === 'Blocked' ? 'active' : ''}`}
          onClick={() => handleTabClick('Blocked')}
        >
          Blocked Cards
        </div>
      </div>

      <div className="card-listing">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by card name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>

        <div className="filter-dropdown">
          <label htmlFor="filter">Filter by Card Type:</label>
          <select id="filter" value={filterType} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="burner">Burner</option>
            <option value="subscription">Subscription</option>
          </select>
        </div>

        {filteredCards.map((card) => (
          <div className={`card ${card.type}`} key={card.id}>
            <div className="card-details">
              <h2>{card.name}</h2>
              <p>{card.type === 'burner' ? `Expires on: ${card.expiry}` : `Limit: ${card.limit}`}</p>
              <p>Owner ID: {card.owner_id}</p>
            </div>
            <div className="card-label">
              {card.type === 'burner' ? <span className="label-burner">Burner</span> : <span className="label-subscription">Subscription</span>}
            </div>
          </div>
        ))}

        {loading && <div className="loading">Loading...</div>}
        {!hasMore && <div className="end-message">No more cards to load.</div>}
      </div>

      <div ref={containerRef} className="scroll-trigger"></div>
    </div>
  );
};

export default CardListing;
