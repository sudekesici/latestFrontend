import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, [currentPage, userTypeFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/v1/admin/users?page=${
          currentPage - 1
        }&size=10&userType=${userTypeFilter}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Kullanıcı listesi yüklenirken bir hata oluştu.");
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (userId, isActive) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/v1/admin/users/${userId}/status`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      setError("Kullanıcı durumu güncellenirken bir hata oluştu.");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setUserTypeFilter(e.target.value);
    setCurrentPage(1);
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-container">
      <h2>Kullanıcı Yönetimi</h2>

      <div className="admin-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="filter-box">
          <select value={userTypeFilter} onChange={handleFilterChange}>
            <option value="ALL">Tüm Kullanıcılar</option>
            <option value="BUYER">Alıcılar</option>
            <option value="SELLER">Satıcılar</option>
          </select>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>E-posta</th>
              <th>Kullanıcı Tipi</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{user.userType === "SELLER" ? "Satıcı" : "Alıcı"}</td>
                <td>
                  <span
                    className={`status ${
                      user.isActive ? "active" : "inactive"
                    }`}
                  >
                    {user.isActive ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleUserStatusChange(user.id, !user.isActive)
                    }
                    className={
                      user.isActive ? "deactivate-btn" : "activate-btn"
                    }
                  >
                    {user.isActive ? "Pasifleştir" : "Aktifleştir"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Önceki
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
};

export default Admin;
