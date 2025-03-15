import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "./CategoryPage.css";

function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Kategori ve ürünleri paralel olarak al
        const [categoryResponse, productsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/v1/categories/${id}`),
          axios.get(`http://localhost:8080/api/v1/products/category/${id}`),
        ]);

        console.log("Category Response:", categoryResponse.data);
        console.log("Products Response:", productsResponse.data);

        // Kategori bilgisini set et
        setCategory(categoryResponse.data);
        setProducts(productsResponse.data);

        // Ürünleri kontrol et ve filtrele
        const responseData = productsResponse.data;
        let filteredProducts = [];

        if (responseData) {
          // Response'un yapısına göre ürünleri al
          const productsArray = responseData.content || responseData;

          if (Array.isArray(productsArray)) {
            filteredProducts = productsArray.filter(
              (product) =>
                product.category && product.category.id === parseInt(id)
            );
          }
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Tam hata:", error);
        setError(
          error.response?.data?.message ||
            "Veriler yüklenirken bir hata oluştu."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!category) return <div className="error">Kategori bulunamadı.</div>;

  return (
    <div className="category-page">
      <div className="category-content">
        <h2 className="category-title">{category.name}</h2>
        <p className="category-description">{category.description}</p>

        {/* Ana kategori ürünleri */}
        <h3 className="product-list-title">
          {category.name} Kategorisindeki Ürünler
        </h3>
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={`http://localhost:8080/images/${product.images[0]}`}
                  alt={product.title}
                  className="product-image"
                />
                <div className="product-details">
                  <h4>{product.title}</h4>
                  <p>{product.description}</p>
                  <p className="product-price">{product.price} TL</p>
                </div>
              </div>
            ))
          ) : (
            <p>Bu kategoride ürün bulunmamaktadır.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
