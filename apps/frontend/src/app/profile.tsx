// type user = {
//   name?: string;
//   andrew_id?: string;
// };

export default function Profile() {
  // async function loadUser(): Promise<user | undefined> {
  //   const response = await fetch("/api/me", { credentials: "include" });
  //   //const data = (await response.json()) as user;
  //   if (!response.ok) {
  //     // not signed in
  //     return;
  //   }

  //   const userData = (await response.json()) as user;

  //   return userData;
  // }

  // const userData = loadUser();
  // userData.catch();
  return (
    <div className="flex h-full justify-left mt-[26px] px-24">
      <div className="flex flex-col px-0 overflow-hidden">
        <h1 className="font-bold text-[32px] py-3 flex-shrink-0">Profile</h1>
        <div className="overflow-y-auto">
          <div className="flex flex-col gap-[16px] items-center sm:items-start pb-2"></div>
        </div>
      </div>
    </div>
  );
}
