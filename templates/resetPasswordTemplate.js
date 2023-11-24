const resetTemplate = (url, resetToken, email) =>
  `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.15/dist/tailwind.min.css" rel="stylesheet">
        <!-- <title>Account Activation</title> -->
    </head>
    <body class="bg-white-300 p-4">
        <table class="max-w-md mx-auto bg-white-100 rounded-lg overflow-hidden shadow-lg p-6">
            <tr>
                <td>
                    <div class="flex items-center justify-center shrink-0 px-4 py-4 text-2xl bg-opacity-5">
                        <svg width="103" height="89" viewBox="0 0 103 89" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_646_4789)">
                            <path d="M70.2752 67.5932C67.9607 67.5932 65.7794 67.3484 63.7321 66.8583C61.729 66.3683 59.9485 65.6556 58.3905 64.7202C56.8771 63.7848 55.6752 62.6268 54.7851 61.2461C53.9393 59.8653 53.5164 58.2616 53.5164 56.4355C53.5164 56.2571 53.5164 56.1013 53.5164 55.9676C53.5164 55.7896 53.5389 55.6338 53.5832 55.5001H63.9324C63.9324 55.5891 63.9324 55.7006 63.9324 55.8339C63.9324 55.9233 63.9324 56.0123 63.9324 56.1013C63.9767 57.0814 64.2885 57.9052 64.8672 58.5736C65.4901 59.197 66.2916 59.6648 67.2706 59.9765C68.25 60.2438 69.3183 60.3775 70.4756 60.3775C71.3214 60.3775 72.2115 60.2885 73.1462 60.1102C74.1256 59.9322 74.9489 59.6201 75.6168 59.1748C76.2843 58.7294 76.6183 58.0836 76.6183 57.2372C76.6183 56.3018 76.1954 55.5891 75.3496 55.0991C74.5485 54.6091 73.458 54.2084 72.0779 53.8964C70.7427 53.54 69.2958 53.2062 67.7382 52.8941C66.1801 52.5378 64.6 52.1371 62.9977 51.6918C61.4397 51.246 59.9931 50.6449 58.6576 49.8878C57.3668 49.0858 56.3206 48.0614 55.5195 46.8143C54.7183 45.5669 54.3179 43.9857 54.3179 42.0706C54.3179 40.0215 54.7405 38.2844 55.5863 36.859C56.4767 35.3889 57.6783 34.2087 59.192 33.3178C60.7053 32.427 62.4412 31.7811 64.3996 31.3802C66.4027 30.9793 68.5172 30.7789 70.7427 30.7789C72.7901 30.7789 74.7263 30.9793 76.5515 31.3802C78.421 31.7811 80.0901 32.4047 81.5591 33.251C83.0725 34.0528 84.2519 35.0995 85.0977 36.3911C85.9435 37.6385 86.3664 39.1083 86.3664 40.801C86.3664 41.0237 86.3439 41.2686 86.2996 41.5359C86.2996 41.7586 86.2996 41.9144 86.2996 42.0038H76.0172V41.4691C76.0172 40.712 75.7725 40.0883 75.2828 39.5983C74.7931 39.1083 74.1256 38.7298 73.2798 38.4624C72.434 38.1507 71.4992 37.9949 70.4756 37.9949C69.808 37.9949 69.1401 38.0617 68.4725 38.1954C67.8492 38.2844 67.2706 38.4403 66.7366 38.6629C66.2023 38.8413 65.7573 39.1083 65.4011 39.4646C65.0897 39.821 64.934 40.2663 64.934 40.801C64.934 41.4691 65.2233 42.0259 65.8019 42.4713C66.3805 42.8723 67.1595 43.2061 68.1386 43.4735C69.1626 43.7409 70.2752 44.0304 71.4771 44.342C73.124 44.6984 74.8599 45.0769 76.6851 45.4779C78.5099 45.8343 80.2237 46.3686 81.826 47.0813C83.4729 47.7497 84.7862 48.7741 85.7653 50.1548C86.7893 51.4912 87.3011 53.3398 87.3011 55.7006C87.3011 57.9277 86.8557 59.8207 85.9656 61.3797C85.0756 62.8941 83.8515 64.119 82.2935 65.0544C80.7355 65.9451 78.9328 66.591 76.8851 66.992C74.8378 67.393 72.6343 67.5932 70.2752 67.5932Z" fill="#FF595A"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M25.9935 40.3916C27.1554 39.7 28.6213 39.364 30.3913 39.3834C32.2162 39.4034 33.6811 39.7756 34.786 40.5006C35.9357 41.1813 36.7481 42.2148 37.2227 43.6009C37.7416 44.9876 37.9901 46.6831 37.968 48.6872L37.9409 51.1592C37.9321 51.9788 37.879 52.7457 37.7817 53.4602C40.3377 55.7516 43.3282 58.1191 46.5975 60.4437C46.6165 60.4099 46.6354 60.3761 46.6544 60.342C48.1977 57.5971 48.9921 54.1539 49.0378 50.0117C49.0832 45.8691 48.3639 42.4315 46.8805 39.6979C45.4413 36.9649 43.3271 34.9148 40.5377 33.5479C37.7929 32.1814 34.4397 31.4764 30.4784 31.4329C26.8021 31.3926 23.6094 31.9462 20.9005 33.0938C22.296 35.3622 23.9856 37.7937 25.9935 40.3916Z" fill="#FF595A"/>
                            <path d="M30.9669 48.9683C-12.7549 -1.27049 36.1322 -2.33261 69.0086 26.0059C63.0339 17.9036 43.834 6.87426 26.8325 3.11059C10.9903 -0.39646 5.21388 7.19009 4.80223 11.7155C0.869427 26.5796 19.1376 45.5331 29.4992 56.2835L29.6654 56.4559C38.0945 65.2014 61.9564 80.9819 76.7069 83.8095C86.3136 85.651 94.6573 84.5137 98.6539 78.7221C100.729 75.7154 100.097 71.5947 99.4062 69.8256C95.4026 94.7892 46.4238 66.7289 30.9669 48.9683Z" fill="#FF595A"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M26.0552 1.08404C13.8696 -1.1069 -1.15112 -0.379744 0.457083 19.4144C1.23298 24.5802 4.97981 34.1367 11.784 43.6652C11.4435 45.3291 11.2733 47.1584 11.2733 49.153C11.2733 53.2952 12.0077 56.7475 13.4766 59.509C14.99 62.2261 17.1266 64.2527 19.8863 65.5891C22.6905 66.9255 26.0512 67.5936 29.9682 67.5936C31.8347 67.5936 33.5677 67.4451 35.1673 67.1486C43.2319 73.6515 49.8232 77.5577 56.5301 81.2042C66.9001 86.8422 83.9569 89.9456 90.4959 88.2468C95.7267 86.8876 98.9957 83.9988 99.9873 82.6715C100.83 81.5433 101.17 80.7402 102.005 78.7689C102.153 78.4206 102.316 78.0358 102.5 77.6062C102.681 77.183 102.676 75.5198 102.671 74.0255C102.671 73.8313 102.67 73.6396 102.67 73.4542C102.702 72.9986 102.705 72.5797 102.683 72.2082C102.672 72.5515 102.67 72.9835 102.67 73.4542C102.397 77.2759 100.002 83.6618 91.7681 86.1281C80.249 89.579 63.2884 82.2335 57.3784 79.6729C54.088 78.2475 44.8233 72.0879 41.5508 69.4942C32.0733 62.3253 16.5133 50.5495 8.54516 35.5437C8.28347 35.051 7.95415 34.4846 7.58335 33.8469C5.18852 29.7287 1.06423 22.6362 2.274 13.1871C3.67108 2.27497 14.7647 0.0941237 21.1774 0.791054L26.0552 1.08404Z" fill="#FF595A"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_646_4789">
                            <rect width="103" height="89" fill="white"/>
                            </clipPath>
                            </defs>
                            </svg>
                    </div>
                    <!-- <div>
                        <h1 class="text-xl font-semibold text-gray-700 my-6 text-center">Join this organization workspace on OvaSite!</h1>
                    </div>     -->
                    <div class="">
                        <p class="text-sm text-gray-500 mb-4 text-center font-semibold border p-4 mx-4 font-sans">
                            Hey ${email}, reset your password and regain account access by clicking the button below. Cheers! 🌟                    
                        </p>
                    </div>
                    <div class="flex flex-col items-center justify-center my-10">
                        <button>
                    <a href="${url}/reset-password/${resetToken}" class="bg-red-500 text-white font-semibold py-2 
                                    px-4 rounded hover:bg-red-400 button-center">Reset Password</a>
                        </button>
                    </div> 
                    <div class="my-10">      
                    <p class="text-sm italic text-gray-300 mt-4 text-center font-semibold">
                        <!-- Just confirming you're you! <br> -->
                        &copy;Copyright <a href="https://oktopals.com/" class="text-sm italic text-gray-400 hover:text-green-400"> OktopalsLLC</a> All Rights Reserved
                        <br>
                        <a href="contact@oktopals.com" class="text-sm text-gray-300 hover:text-red-400">contact@oktopals.com</a>
                    </p>
                  </div> 
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

export default resetTemplate;