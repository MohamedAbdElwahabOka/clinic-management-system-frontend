"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar"; 
import { useState } from "react";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'; 
// 1. استيراد useLocale عشان نعرف اللغة
import { useLocale } from 'next-intl';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  
  // 2. تحديد اتجاه اللغة
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      
      {/* 3. التعديل هنا:
          غيرنا side="left" لشرط ديناميكي
          لو عربي (isRTL) يفتح من right، غير كدة يفتح من left
      */}
      <SheetContent 
        side={isRTL ? "right" : "left"} 
        className="p-0 w-64 bg-gray-900 border-none [&>button]:hidden text-white z-[1000]"
      >
        <VisuallyHidden.Root>
          <SheetTitle>Menu</SheetTitle>
        </VisuallyHidden.Root>

        <Sidebar onMobileClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}















// "use client";

// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Menu } from "lucide-react";
// import Sidebar from "@/components/Sidebar"; 
// import { useState } from "react";

// export default function MobileNav() {
//   const [open, setOpen] = useState(false);

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden">
//           <Menu className="h-6 w-6" />
//           <span className="sr-only">Toggle Menu</span>
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0 w-72 border-r bg-background">
//         <Sidebar />
//       </SheetContent>
//     </Sheet>
//   );
// }