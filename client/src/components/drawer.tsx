import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  
  type Props = {
    children: React.ReactNode;
  };


    export const DrawerComponent: React.FC<Props> = ({children}) => {
        return (
            <Drawer>
            <DrawerTrigger >{children}</DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>This action cannot be undone.</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
              
                <DrawerClose>
                
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          
        );
    }