import Image from "next/image";
function CompanyGallery() {
  return (
    <div className="grid grid-cols-2 grid-rows-6 gap-4 h-full min-h-110">
      {/* Column 1 */}
      <div className="relative col-start-1 row-span-3">
        <Image
          src="/categories/diamond.jpg"
          alt="Diamond"
          fill
          className="object-cover rounded-xl"
        />
      </div>

      <div className="relative col-start-1 row-start-4 row-span-3">
        <Image
          src="/categories/electric.jpg"
          alt="electric"
          fill
          className="object-cover rounded-xl"
        />
      </div>

      {/* Column 2 */}
      <div className="relative col-start-2 row-span-2">
        <Image
          src="/categories/grinder.jpg"
          alt="grinder"
          fill
          className="object-cover rounded-xl"
        />
      </div>

      <div className="relative col-start-2 row-span-2">
        <Image
          src="/categories/hand-tools.jpg"
          alt="hand-tools"
          fill
          className="object-cover rounded-xl"
        />
      </div>

      <div className="relative col-start-2 row-span-2">
        <Image
          src="/categories/diamond.jpg"
          alt="Diamond"
          fill
          className="object-cover rounded-xl"
        />
      </div>
    </div>
  );
}

export default CompanyGallery;
