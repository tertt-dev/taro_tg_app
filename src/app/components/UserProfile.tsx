import { getJWTFromCookies, verifyJWT } from '@/lib/jwt';

export default async function UserProfile() {
  const token = await getJWTFromCookies();
  const userData = token ? await verifyJWT(token) : null;

  if (!userData) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div>
      <h1>Welcome {userData.username}!</h1>
      <div>
        <p>Name: {userData.first_name} {userData.last_name}</p>
        <p>User ID: {userData.id}</p>
      </div>
    </div>
  );
} 