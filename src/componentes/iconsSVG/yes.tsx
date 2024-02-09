
export function YesSVG(props?: any) {
  return (
    <svg
      height="200px"
      width="200px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
      fill="#000"
      {...props}
    >
      <circle cx={256} cy={256} r={256} fill="#59cb5d" />
      <path
        d="M256 0v512c141.385 0 256-114.615 256-256S397.385 0 256 0z"
        fill="#20c326"
      />
      <path
        fill="#f2f2f4"
        d="M219.429 367.932L108.606 257.108 147.394 218.32 219.429 290.353 355.463 154.32 394.251 193.108z"
      />
      <path
        fill="#dfdfe1"
        d="M256 331.361L394.251 193.108 355.463 154.32 256 253.782z"
      />
    </svg>
  )
}
