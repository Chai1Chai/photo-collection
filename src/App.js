import React from 'react';
import {Collection} from './Collection';
import './index.scss';

const cats = [
  { "name": "Все" },
  { "name": "Море" },
  { "name": "Горы" },
  { "name": "Архитектура" },
  { "name": "Города" }
];

function App() {
  const [categoryId, setCategoryId] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchValue, setSearchValue] = React.useState('');
  const [collections, setCollections] = React.useState([]);

  const itemsPerPage = 3;

  React.useEffect(() => {
    setIsLoading(true);
    fetch('/data.json')
      .then((res) => res.json())
      .then((data) => {
        if (categoryId === 0) {
          setCollections(data.collections);
        } else {
          const filtered = data.collections.filter(
            obj => obj.category === categoryId
          );
          setCollections(filtered);
        }
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при загрузке данных');
      }).finally(() => setIsLoading(false));
  }, [categoryId]);

  React.useEffect(() => {
    setPage(1);
  }, [categoryId]);

  const filteredCollections = collections.filter(obj => {
    return obj.name.toLowerCase().includes(searchValue.toLowerCase());
  });
  
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  
  const currentPageCollections = filteredCollections.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {cats.map((obj, i) => (
            <li 
              onClick={() => setCategoryId(i)}
              className={categoryId === i ? 'active' : ''} 
              key={obj.name}
            >
              {obj.name}
            </li>
          ))}
        </ul>
        <input 
          value={searchValue} 
          onChange={(e) => setSearchValue(e.target.value)} 
          className="search-input" 
          placeholder="Поиск по названию" 
        />
      </div>
      
      <div className="content">
        {isLoading ? (
          <h2>Идет загрузка ...</h2>
        ) : (
          currentPageCollections.map((obj, index) => (
            <Collection
              key={index}
              name={obj.name}
              images={obj.photos}
            />
          ))
        )}
      </div>
      
      {totalPages > 1 && (
        <ul className="pagination">
          {[...Array(totalPages)].map((_, i) => {
            const pageNumber = i + 1; 
            return (
              <li 
                key={i}
                onClick={() => setPage(pageNumber)} 
                className={page === pageNumber ? 'active' : ''} 
              >
                {pageNumber}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default App;
