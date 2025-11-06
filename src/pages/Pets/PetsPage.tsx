import React from "react";
import PetCard from "../../components/PetCard/PetCard";
import NotificationButton from "../../components/NotificationButton/NotificationButton";
import "./PetsPage.css";

const PetsPage: React.FC = () => {
  const pets = [
    {
      id: 1,
      name: "Kiwi",
      type: "cat",
      age: "18 months",
      vaccines: "3/5 vaccines",
      medicines: "2 medicines",
      image: "/images/kiwi.png",
      color: "#EAD7FF",
    },
    {
      id: 2,
      name: "Caneli",
      type: "dog",
      age: "12 months",
      vaccines: "2/5 vaccines",
      medicines: "Without medication",
      image: "/images/caneli.png",
      color: "#FFE8B3",
      alert: true,
    },
  ];

  return (
    <>
      <div className="pets-container">
        <div className="pets-content">
          <div className="pets-header">
            <h1>Your pets are so cute!</h1>
          </div>

          <div className="pets-sections">
            {/* Add Pet Section */}
            <div className="section-add">
              <div className="add-pet-card">
                <p className="add-pet-text">Let’s say hi to...</p>
                <div className="add-pet-icons">
                  <img
                    src="/images/add-pet-plus.png"
                    alt="add"
                    className="add-pet-plus"
                  />
                  <img
                    src="/images/add-pet-silhouettes.png"
                    alt="pets"
                    className="add-pet-silhouettes"
                  />
                </div>
              </div>
            </div>

            {/* Pet List Section */}
            <div className="section-pets">
              {pets.map((pet) => (
                <div key={pet.id} className="section-pet-card">
                  <PetCard
                    name={pet.name}
                    age={pet.age}
                    vaccines={pet.vaccines}
                    medicines={pet.medicines}
                    image={pet.image}
                    color={pet.color}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <NotificationButton />
    </>
  );
};

export default PetsPage;
