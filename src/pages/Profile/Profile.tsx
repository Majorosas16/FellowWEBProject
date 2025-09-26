import ProfileCard from '../../components/ProfileCard/ProfileCard'
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation'

const Profile: React.FC = () => {
  // For demo purposes, using a default username
  // In a real app, this would come from user authentication

  // Sample health events data
  const userProfile = {
    userName: 'Carolina',
    userImage: '/images/dog-golden-retriever.webp',
    userMail: 'carolina@hotmail.com',
  }
  return (
    <>
      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-header">
            <h1>Is this you ?</h1>
          </div>

          <div className="profile-sections">
            <div className="section">
              <ProfileCard
                userName={userProfile.userName}
                userImage={userProfile.userImage}
                userMail={userProfile.userMail}
              />
              <p>holi</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </>
  )
}

export default Profile
