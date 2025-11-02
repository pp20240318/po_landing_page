import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface Config {
  site: {
    title: string;
    description: string;
    favicon: string;
  };
  links: {
    customerService: string;
    link2: string;
    link3: string;
  };
}

interface AppProps { }

const App: React.FC<AppProps> = () => {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [qrPicShow, setQrPicShow] = useState<boolean>(false);
  const [config, setConfig] = useState<Config | null>(null);
  const [cid, setCid] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = (): void => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    // 获取url参数
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('inviteCode');
    setCid(urlParams.get('cid'));
    // const cid = urlParams.get('cid');

    console.log(inviteCode, cid);

    // 将 inviteCode 复制到剪贴板
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode)
        .then(() => {
          console.log('邀请码已复制到剪贴板:', inviteCode);
        })
        .catch((err) => {
          console.error('复制邀请码失败:', err);
        });
    }
    // 加载配置文件
    fetch('/config.json')
      .then(response => response.json())
      .then((data: Config) => {
        setConfig(data);
        // 设置页面标题
        document.title = data.site.title;
        // 设置页面描述
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', data.site.description);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'description';
          meta.content = data.site.description;
          document.head.appendChild(meta);
        }
        // 设置favicon
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
          favicon.href = data.site.favicon;
        }
      })
      .catch(error => {
        console.error('Failed to load config:', error);
        // 使用默认配置
        setConfig({
          site: { title: "Landing Page", description: "默认描述", favicon: "/favicon.ico" },
          links: { customerService: "#", link2: "#", link3: "#" }
        });
      });
  }, []);

  const getButtonWidth = (): string => {
    if (windowWidth < 640) return "3rem"; // w-12 (48px = 3rem)
    if (windowWidth < 768) return "4rem"; // sm:w-16 (64px = 4rem)
    if (windowWidth < 1024) return "5rem"; // md:w-20 (80px = 5rem)
    return "6rem"; // lg:w-24 (96px = 6rem)
  };

  const handleQRButtonClick = (): void => {
    setQrPicShow(true);
  };

  const handleCustomerServiceClick = (): void => {
    if (config?.links.customerService && config.links.customerService !== "#") {
      window.open(config.links.customerService, '_blank');
    }
  };
  const handleLink2Click = (): void => {
    if (config?.links.link2 && config.links.link2 !== "#") {
      window.open(config.links.link2, '_blank');
    }
  };
  const handleLink3Click = (): void => {
    if (config?.links.link3 && config.links.link3 !== "#") {
      if (cid) {
        const url = config.links.link3.replace(/\{0\}/g, cid);
        window.open(url, '_blank');
      }
      else {
        window.open(config.links.link3, '_blank');
      }

    }
  };

  // 如果配置还没加载完成，显示加载状态
  if (!config) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="relative m-[0] p-[0] font-sans">
        {qrPicShow && (
          <div
            className="top-[0] right-[0] bottom-[0] left-[0] z-[50] fixed"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem'
            }}
            onClick={() => setQrPicShow(false)}
          >
            <div
              className="relative shadow-2xl rounded-lg"
              style={{
                maxWidth: '600px',
                width: '100%'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="top-[0.75rem] right-[0.75rem] z-[10] absolute bg-white p-[0.5rem] rounded-full text-gray-500"
                onClick={() => setQrPicShow(false)}
                aria-label="关闭"
              >
                <IoClose className="w-[1.5rem] h-[1.5rem]" />
              </button>
              <div
                className="p-[2rem] pt-[4rem] pb-[2rem]"
                style={{
                  backgroundImage: "url(image/x1.png)",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center",
                }}
              >
                <div
                  className="gap-[1.5rem] grid grid-cols-2 mt-[6rem]"
                >
                  {/* <div className="flex justify-center items-center">
                    <img
                      src="image/x2.png"
                      className="w-[5rem] h-auto"
                    />
                  </div> */}
                  <div className="flex justify-center items-center">
                    <img
                      src="image/x3.png"
                      className="w-[5rem] h-auto"
                    />
                  </div>
                  <div className="flex justify-center items-center">
                    <img
                      src="image/x4.png"
                      className="w-[8rem] md:w-[20rem] h-auto"
                    />
                  </div>
                  {/* <div className="flex justify-center items-center">
                    <img
                      src="image/x5.png"
                      className="w-[8rem] md:w-[20rem] h-auto"
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        )}
        <div
          className="relative bg-no-repeat mx-auto max-w-[62.5rem]"
          style={{
            backgroundImage: "url(image/bg.png)",
            backgroundSize: "100% 100%",
          }}
        >
          {/* 右上角浮动按钮 - 响应式缩放 */}
          <div
            className="top-[5rem] right-[4px] z-[20] absolute flex flex-col space-y-[0.5rem]"
            style={{ width: getButtonWidth() }}
          >
            <div>
              <img
                src="image/service-button.png"
                className="w-full h-auto transition-transform duration-[300ms] cursor-pointer"
                onClick={handleCustomerServiceClick}
              />
            </div>
            <div>
              <img
                onClick={() => {
                  handleQRButtonClick();
                }}
                src="image/QRcode-en.png"
                className="w-full h-auto transition-transform duration-[300ms] cursor-pointer"
              />
            </div>
          </div>

          <div className="text-center">
            <img
              src="image/z2.png"
              className="mx-auto h-auto"
              style={{
                width:
                  windowWidth < 640
                    ? "90%"
                    : windowWidth < 768
                      ? "80%"
                      : windowWidth < 1024
                        ? "70%"
                        : "auto",
                maxWidth: "100%",
              }}
            />
          </div>
          <div className="text-center">
            <img src="image/a2.png" className="w-full" />
          </div>
          <div className="text-center" onClick={() => { handleLink2Click() }}>
            <img src="image/a3.png" className="mx-auto w-[75%]" />
          </div>
          <div className="text-center">
            <img src="image/a4.png" className="w-full" />
          </div>

          {/* Image Grid - 4 per row on desktop, 2 per row on mobile */}
          <div className="gap-[0.5rem] md:gap-[1rem] grid grid-cols-4 p-[1rem] md:p-[2rem]">
            {[
              "b1",
              "b2",
              "b3",
              "b4",
              "b5",
              "b6",
              "b7",
              "b8",
              "b9",
              "b10",
              "b11",
              "b12",
            ].map((imageName: string) => (
              <div key={imageName} className="flex justify-center items-center">
                <img
                  src={`image/${imageName}.png`}
                  className="rounded-lg w-full h-auto hover:scale-[1.05] transition-transform duration-[300ms]"
                />
              </div>
            ))}
          </div>

          {/* Bottom sections */}
          {["c", "d", "e", "f", "i", "j", "k", "m"].map((imageName: string) => (
            <div key={imageName} className="text-center">
              <img src={`image/${imageName}.png`} className="w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* 浮动在页面底部的图片 */}
      <div className="bottom-[0] left-[0] z-[10] fixed flex justify-center w-full" onClick={() => { handleLink3Click() }}>
        <img
          src="/image/bottom.png"
          className="block w-full max-w-[62.5rem] h-auto"
        />
      </div>

    </>
  );
};

export default App;
