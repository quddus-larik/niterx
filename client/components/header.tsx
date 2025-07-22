"use client";

import { FaShoppingCart, FaTimesCircle, FaTrashAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Button,
  Badge,
  User,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
  Link,
} from "@heroui/react";
import { HeartHandshake, HistoryIcon, Icon, LogOut, NotepadText, Settings, UserRound } from "lucide-react";

interface UserData {
  error: boolean,
  user: object
}

interface HeaderProps {
  loggedInUserData: UserData | null;
  totalCartItems: number;
  onClearCart: () => void;
  onToggleCartModal: () => void;
}

export default function Header({
  loggedInUserData,
  totalCartItems,
  onClearCart,
  onToggleCartModal,
}: HeaderProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/phones" });
  };

  

  console.log("error:", loggedInUserData)
  

  return (
    <header className="fixed z-20 w-full bg-white shadow-sm">
      <div className="flex flex-col items-center justify-between p-4 mx-auto max-w-7xl sm:flex-row">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">NiterX</h1>
          <p className="text-sm text-gray-500">Browse our latest mobile stock collection</p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Link href="#" size="sm">Category</Link>
          <Link href="#" size="sm">Products</Link>
          <Link href="#" size="sm">Latest Stocks</Link>
        </div>
        <div className="relative flex items-center gap-4 mt-4 sm:mt-0">
          <Badge
            content={totalCartItems}
            color={totalCartItems === 0 ? "warning" : "primary"}
            size="md"
            className="text-tiny"
          >
            <Button
              disableAnimation
              isIconOnly
              variant="light"
              onPress={onToggleCartModal}
            >
              <FaShoppingCart className="text-2xl text-gray-600" />
            </Button>
          </Badge>

          {totalCartItems > 0 && (
            <Button
              disableAnimation
              color="danger"
              onPress={onClearCart}
              startContent={<FaTrashAlt />}
              size="sm"
              isIconOnly
              variant="flat"
            />
          )}
          
          {!loggedInUserData?.error ? (
            <Dropdown placement="bottom-end" size="sm">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: loggedInUserData?.user.image || "https://static.vecteezy.com/system/resources/previews/005/005/788/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg",
                  }}
                  className="transition-transform"
                />
              </DropdownTrigger>

              <DropdownMenu  aria-label="User Actions" variant="faded">
                <DropdownItem key="profile" startContent={<UserRound className="h-5" />} description="Your Profile" onPress={()=> window.open("/profile")}>
                  {loggedInUserData?.user.name}
                </DropdownItem>
                <DropdownItem key="team_settings" startContent={<NotepadText className="h-5"/>} description="History & Track orders" onClick={()=> window.location.href="/orders"} >Orders</DropdownItem>

                <DropdownItem key="settings" startContent={<Settings className="h-6" />} description="modify accessibility" onClick={()=> window.location.href="/settings"}>Settings</DropdownItem>
                <DropdownItem key="help_and_feedback" startContent={<HeartHandshake className="h-5" />} description="complaints & support" onClick={()=> window.location.href="/feedback"}>
                  Help & Feedback
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={onOpen} startContent={<LogOut className="h-5" />} description="leave market" >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button onPress={()=> router.push("/api/auth/signin")} color="primary" size="sm">
              Login
            </Button>
          )}
        </div>
      </div>

      <Modal
        disableAnimation
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>Confirm Logout?</ModalHeader>
          <Divider />
          <ModalBody>
            You are going to logout account connectivity!
          </ModalBody>
          <ModalFooter>
            <Button onPress={onOpenChange} color="default" size="md">
              Cancel
            </Button>
            <Button onPress={handleSignOut} color="danger" size="md">
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </header>
  );
}
