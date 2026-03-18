import tydlineLogo from "../assets/tydline-sqaurlogo.png";

interface Article {
  iconLeft: string;
  iconRight: string;
  description: string;
}

interface HeroCardProps {
  image: string;
  articles: Article[];
}

function HeroCard({ image, articles }: HeroCardProps) {
  return (
    <div className="relative w-[90%] md:w-[60%]">
      {/* Corner brackets */}
      <span className="absolute -top-3 -left-3 w-10 h-10 border-t-3 border-l-3 border-[#FF8400]" />
      <span className="absolute -top-3 -right-3 w-10 h-10 border-t-3 border-r-3 border-[#FF8400]" />
      <span className="absolute -bottom-3 -left-3 w-10 h-10 border-b-3 border-l-3 border-[#FF8400]" />
      <span className="absolute -bottom-3 -right-3 w-10 h-10 border-b-3 border-r-3 border-[#FF8400]" />

      <section className="flex flex-col md:flex-row w-full md:h-52 border border-[#052698]/30 overflow-hidden shadow-sm">
        {/* Top on mobile / Left on desktop — image */}
        <div className="w-full md:w-1/2 h-36 md:h-auto shrink-0 overflow-hidden">
          <img
            src={image}
            alt="Cargo ship"
            className="w-full h-full object-cover object-center [transform:scale(-1.25,1.25)_translateX(-8%)]"
          />
        </div>

        {/* Bottom on mobile / Right on desktop — articles */}
        <div className="w-full md:w-1/2 h-full flex flex-col divide-y divide-[#052698]/10 border-t md:border-t-0 md:border-l border-[#052698]/20">
          {articles.map((article, index) => (
            <article
              key={index}
              className="flex-1 min-h-[48px] md:min-h-0 overflow-hidden flex flex-row items-center gap-3 px-4 relative bg-[#FFF5EC]"
            >
              {/* Icons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <img
                  src={article.iconLeft}
                  alt=""
                  className="w-8 h-8 shrink-0"
                />
                <img
                  src={article.iconRight}
                  alt=""
                  className="w-8 h-8 shrink-0"
                />
              </div>

              {/* Colon separator */}
              <span className="text-[#545454] font-medium shrink-0">:</span>

              {/* Description */}
              <p className="text-[#545454] font-medium h-full flex items-center leading-none truncate">
                {article.description}
              </p>

              {/* Logo on last article */}
              {index === articles.length - 1 && (
                <img
                  src={tydlineLogo}
                  alt="Tydline"
                  className="absolute right-3 bottom-2 h-6 opacity-80"
                />
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HeroCard;
