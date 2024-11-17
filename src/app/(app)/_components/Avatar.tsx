import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Avatar({ user }: { user: any }) {

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-10 h-10 rounded-full flex items-center justify-center bg-black text-custom-purple-light border-custom-purple">
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-3xl lg:max-w-3xl xl:max-w-3xl overflow-y-auto pt-0
        justify-between gap-10 h-screen bg-[rgba(49,38,85,0.07)] shadow-lg shadow-[rgba(31,38,135,0.37)] 
        backdrop-blur-[7.5px] rounded-xl border-[rgba(255,255,255,0.18)]" >
        <SheetHeader>
          <SheetTitle>{user?.username || "User Profile"}</SheetTitle>
          <SheetDescription>
            View and edit your profile information below.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <p className="mt-1 text-sm text-gray-900">{user?.username || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{user?.email || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Image</label>
              {user?.profileImg ? (
                <img
                  src={user.profileImg}
                  alt="Profile"
                  className="mt-2 h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-500">No profile image available</p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
