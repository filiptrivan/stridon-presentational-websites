export type Catalog = {
  id: number;
  title: string;
  brandSlug: string;
  logoSrc: string;
  pdfUrl: string;
  color: string;
};

export const CATALOGS: Catalog[] = [
  { id: 27, title: "Dewalt najprodavanije 2023", brandSlug: "dewalt", logoSrc: "/logos/dewalt-logo.svg", pdfUrl: "https://drive.google.com/file/d/1RuMzUGAO4sBoTsBYby_-qGIo5jlFirfP/view?usp=share", color: "#ECFF44" },
  { id: 28, title: "Dewalt ograničeno izdanje", brandSlug: "dewalt", logoSrc: "/logos/dewalt-logo.svg", pdfUrl: "https://drive.google.com/file/d/13y1RuBHKXtsudGYMzIi67ym4w5rb3jew/view?usp=share", color: "#ECFF44" },
  { id: 1, title: "Bosch DIY merni alati", brandSlug: "bosch", logoSrc: "/logos/bosch-logo.svg", pdfUrl: "https://drive.google.com/file/d/1BK8KkkGrq2n9J9x3M0ZysdQ24MdhjAqe/view?usp=share", color: "#05B920" },
  { id: 2, title: "Bosch pribor", brandSlug: "bosch", logoSrc: "/logos/bosch-logo.svg", pdfUrl: "https://drive.google.com/file/d/1oVevfXbBrPfboKAJIQA62reSEowTyio7/view?usp=share", color: "#FF0000" },
  { id: 3, title: "Bosch Dremel", brandSlug: "bosch", logoSrc: "/logos/bosch-logo.svg", pdfUrl: "https://drive.google.com/file/d/1xdVeZDXHNFhN3AwYE6XSW5dzVtcB_hSG/view?usp=share", color: "#2967FF" },
  { id: 4, title: "Bosch EXPERT", brandSlug: "bosch", logoSrc: "/logos/bosch-logo.svg", pdfUrl: "https://drive.google.com/file/d/1rpkCB0d9SXnuQ3Pg1WXzV3yUKCLhICSz/view?usp=share", color: "#2967FF" },
  { id: 5, title: "Bosch Plavi", brandSlug: "bosch", logoSrc: "/logos/bosch-logo.svg", pdfUrl: "https://drive.google.com/file/d/1lEwdsuzYNCMiq997mi2cS2jvPXfc6p88/view?usp=share", color: "#2967FF" },
  { id: 6, title: "Bosch VP cenovnik", brandSlug: "bosch", logoSrc: "/logos/bosch-logo.svg", pdfUrl: "https://drive.google.com/file/d/1966qI7dLpBlcsJkuEoaoxc9XzvShqH-H/view?usp=share", color: "#FF0000" },
  { id: 29, title: "Stanley katalog", brandSlug: "stanley", logoSrc: "/logos/stanley-logo.svg", pdfUrl: "https://drive.google.com/file/d/1B7teaotZAfVehBOZt-ENZvG3kRFScO9i/view?usp=drive_link", color: "#ECFF44" },
  { id: 7, title: "GTV katalog", brandSlug: "gtv", logoSrc: "/logos/gtv-logo.png", pdfUrl: "https://drive.google.com/file/d/1O7cEdZPw2CyvNTsxmfR7ZpL9GAXlpJ5k/view?usp=share", color: "#845EC2" },
  { id: 8, title: "Hogert električarski alati", brandSlug: "hogert", logoSrc: "/logos/hogert-logo.png", pdfUrl: "https://drive.google.com/file/d/1hIUpfarX9a1t8VKnGRGQabIm0u2eNwdh/view?usp=share", color: "#4F73FF" },
  { id: 9, title: "Hogert HTZ", brandSlug: "hogert", logoSrc: "/logos/hogert-logo.png", pdfUrl: "https://drive.google.com/file/d/16VbxheVuQsX2_aXxc61DBd4Gn0NqcgKZ/view?usp=share", color: "#4F73FF" },
  { id: 10, title: "Hogert odeća katalog", brandSlug: "hogert", logoSrc: "/logos/hogert-logo.png", pdfUrl: "https://drive.google.com/file/d/1CX8oW1BicRW6SdUNhOAxamVy_Y1dnUCw/view?usp=share", color: "#4F73FF" },
  { id: 11, title: "Hogert ručni alati", brandSlug: "hogert", logoSrc: "/logos/hogert-logo.png", pdfUrl: "https://drive.google.com/file/d/1hFN3PuIF2n-LS86D3cGeI0sIlmXoMUTe/view?usp=share", color: "#4F73FF" },
  { id: 12, title: "Karcher profesionalni program katalog", brandSlug: "karcher", logoSrc: "/logos/karcher-logo.svg", pdfUrl: "https://drive.google.com/file/d/1rCZ63RGygIn4IeTTar4sLetDzc7UUoaJ/view?usp=share", color: "#ECFF44" },
  { id: 13, title: "Karcher žuti program katalog", brandSlug: "karcher", logoSrc: "/logos/karcher-logo.svg", pdfUrl: "https://drive.google.com/file/d/14ERZxuCZexyQZ0rNtbBUXGXKjzZm_x5Q/view?usp=share", color: "#ECFF44" },
  { id: 14, title: "Knipex katalog", brandSlug: "knipex", logoSrc: "/logos/knipex-logo.svg", pdfUrl: "https://drive.google.com/file/d/1YgRP6jOCM6D4apCU-mRM_3mNn2yWiTpN/view?usp=share", color: "#FF0000" },
  { id: 15, title: "KWB AKKU TOP pribor za aku alate", brandSlug: "kwb", logoSrc: "/logos/kwb-logo.svg", pdfUrl: "https://drive.google.com/file/d/14yFw6dV6jnzqwOksY9_AECaI6wX3K8te/view?usp=share", color: "#C8C8C8" },
  { id: 16, title: "KWB dodaci za mašine katalog", brandSlug: "kwb", logoSrc: "/logos/kwb-logo.svg", pdfUrl: "https://drive.google.com/file/d/1CpjLO7fBAU_twmPZy5KfHNJk27BG0MhV/view?usp=share", color: "#C8C8C8" },
  { id: 17, title: "KWB pribor", brandSlug: "kwb", logoSrc: "/logos/kwb-logo.svg", pdfUrl: "https://drive.google.com/file/d/1E06fPvQOqKfLGxCzWH-nh_GQYfK2XtOz/view?usp=share", color: "#C8C8C8" },
  { id: 18, title: "MAX katalog", brandSlug: "max", logoSrc: "/logos/max-logo.svg", pdfUrl: "https://drive.google.com/file/d/1k3AzwfcE_RlB8xJiO1Tp1nZQwrnEyZje/view?usp=share", color: "#FFA43B" },
  { id: 19, title: "MTX, Sparta katalog", brandSlug: "mtx", logoSrc: "/logos/mtx-logo.svg", pdfUrl: "https://drive.google.com/file/d/1wASvbffFJGKsAIN9fb1R48XCrtJmYXkM/view?usp=share", color: "#FF5376" },
  { id: 20, title: "Rems akcija 2023", brandSlug: "rems", logoSrc: "/logos/rems-logo.png", pdfUrl: "https://drive.google.com/file/d/1S_H99PFic4pdtzFZOw2lSC0URAo6YFcV/view?usp=share", color: "#ECFF44" },
  { id: 21, title: "Rubi akcija 2023", brandSlug: "rubi", logoSrc: "/logos/rubi-logo.svg", pdfUrl: "https://drive.google.com/file/d/1Pu0Sd3ZYpC0pF6NHKWoyE0qMG8Upuxv7/view?usp=share", color: "#FF0000" },
  { id: 22, title: "Wera katalog", brandSlug: "wera", logoSrc: "/logos/wera-logo.svg", pdfUrl: "https://drive.google.com/file/d/140HnM3JRm2k_F4iF_j46tbchAST-S45O/view?usp=share", color: "#05B920" },
  { id: 23, title: "Wiha katalog", brandSlug: "wiha", logoSrc: "/logos/wiha-logo.svg", pdfUrl: "https://drive.google.com/file/d/1s2s4TmSn_7inwljmfF0mznbdVXWMGEDJ/view?usp=share", color: "#C8C8C8" },
  { id: 24, title: "Wiha merni alati", brandSlug: "wiha", logoSrc: "/logos/wiha-logo.svg", pdfUrl: "https://drive.google.com/file/d/196RbKP5DyiWkJnqvOx1ML10Gby4M2CiG/view?usp=share", color: "#C8C8C8" },
  { id: 25, title: "Wiha XXL III kofer", brandSlug: "wiha", logoSrc: "/logos/wiha-logo.svg", pdfUrl: "https://drive.google.com/file/d/1gfqq3qQRqocaSAXVwRm-3s9lGDpyDNbn/view?usp=share", color: "#C8C8C8" },
  { id: 26, title: "Wolfcraft katalog", brandSlug: "wolfcraft", logoSrc: "/logos/wolfcraft-logo.svg", pdfUrl: "https://drive.google.com/file/d/1SU0y0Lr9TvJqvX0t20R44H6HxHLiWaZJ/view?usp=share", color: "#53FF6C" },
];
