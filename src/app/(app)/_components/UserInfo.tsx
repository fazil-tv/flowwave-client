"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Camera, Upload, Trash2, Save } from 'lucide-react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import StarsAnimation from "@/components/ui/stars-bg";
import { AvatarFallback, AvatarImage, Avatar } from "@radix-ui/react-avatar";
import { useRef, useState } from "react";
import { useUploadProfileImageMutation } from "@/redux/user/userApi";
import { makeApiCall } from "@/utils/makeApiCall";
import { TaskSpinner } from "@/components/animated/spinner";

export function UserInfo({ user, refetch }: { user: any; refetch: () => void }) {


  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProfileImage, { isLoading }] = useUploadProfileImageMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);


      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file);

      await makeApiCall(
        () => uploadProfileImage(formData).unwrap(),
        {

          afterSuccess: () => {
            setPreviewUrl(null);
            setIsHovered(false);
            setFile(null);
            refetch();


          },
          afterError: (error: any) => {

            console.error(error);
          }
        }
      );
    }
  };
  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Sheet>
   <SheetTrigger asChild>
    <Button variant="outline" className="p-0 w-12 h-12 rounded-full  items-center justify-center text-custom-purple-light border-custom-purple">
        {user?.profileImg ? (
            <img 
                src={user?.profileImg} 
                alt={user.username || "User Avatar"} 
                className="w-full h-full rounded-full object-cover" 
            />
        ) : (
            <span className="text-lg">
                {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
            </span>
        )}
    </Button>
</SheetTrigger>

      <SheetContent
        side="right"
        className="w-full !h-screen sm:max-w-xl md:max-w-3xl lg:max-w-3xl xl:max-w-3xl overflow-y-auto pt-0  px-0
        justify-between gap-10  bg-[rgba(49,38,85,0.07)] shadow-lg shadow-[rgba(31,38,135,0.37)] 
        backdrop-blur-[10.5px] rounded-s-xl border-[rgba(255,255,255,0.18)] " >



        <Card className="w-full max-w-3xl mx-auto bg-transparent border-none ">
          <CardHeader className="p-0 ">
            <StarsAnimation />
            <div className=" h-48 bg-[url('/images/invite-bg.svg')] bg-cover bg-center !mt-0">

              <div className="w-screen">
                <p className="p-5 text-white">Hi, <span className="mx-2 font-bold text-custom-purple-light">{user?.username || "User Profile"}</span></p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative top-[-65px] px-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div
              className="relative w-32 h-32 rounded-full overflow-hidden group left-7  border-4 border-custom-purple-light"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Avatar className="w-full h-full ">
                <AvatarImage
                  src={previewUrl || user?.profileImg || "/images/user-img.jpeg"}
                  alt="User Avatar"
                  className="bg-cover"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>

              <div className={`  
                absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center  
                transition-opacity duration-300 ease-in-out  
                ${isHovered ? 'opacity-100' : 'opacity-0'}  
              `}>
                <div className="flex space-x-2 mb-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-white/80 hover:bg-white"
                    onClick={triggerFileInput}
                    disabled={isLoading}
                  >
                    <Upload className="h-4 w-4 text-gray-800" />
                    <span className="sr-only">Upload photo</span>
                  </Button>
                </div>
                {previewUrl && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-full"
                    onClick={handleRemoveImage}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove photo</span>
                  </Button>
                )}




              </div>


            </div>

            {file && (
              <Button
                size="sm"
                variant="link"
                className="rounded-full relative bottom-10 left-[115px] bg-custom-purple"
                onClick={handleUpload}
              >

                {isLoading ? <TaskSpinner /> : <Save className="h-4 w-4 text-white " />}
              </Button>
            )}




            <div className=" items-start mb-4 mt-5">
              <div>
                <h2 className="text-2xl font-bold text-white">{user?.username || "User Profile"}</h2>
                <p className="text-white text-sm mt-2">{user?.email || "N/A"}</p>
                <p className="text-white text-sm mt-1"> Flowwave User ID : <span className="text-white font-bold">  USER{user?._id ? user._id.slice(-8) : "N/A"} </span></p>
              </div>
              <div className="mt-3">
                <p className="text-sm text-red-500 cursor-pointer" >Edit your profile</p>
              </div>

            </div>

          </CardContent>
        </Card>


      </SheetContent>

    </Sheet>
  );
}
