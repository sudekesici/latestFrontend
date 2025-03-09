import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function CategoryPage() {
  const { id } = useParams(); // URL'den id parametresini alıyoruz
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/categories/${id}`
        );
        setCategory(response.data); // Kategoriyi state'e kaydediyoruz
      } catch (error) {
        console.error("Kategori verisi alınırken hata oluştu:", error);
      }
    };

    fetchCategory();
  }, [id]); // id değiştikçe yeniden veri çekilecek

  if (!category) return <div>Yükleniyor...</div>;

  return (
    <div>
      <h2>{category.name}</h2>
      <p>{category.description}</p>
      {/* Eğer kategoriye bağlı bir parent varsa onu da göster */}
      {category.parent && (
        <div>
          <h3>Bağlı Kategori: {category.parent.name}</h3>
          <p>{category.parent.description}</p>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
