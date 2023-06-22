import { useEffect, useState } from 'react'

const TypingEffect = ({ words }: { words: string[] }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    const currentWord = words[currentWordIndex]

    // eslint-disable-next-line no-undef
    let timer: string | number | NodeJS.Timeout | undefined

    if (displayText === currentWord) {
      timer = setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
        setDisplayText('')
      }, 3000)
    } else if (displayText.length < currentWord.length) {
      timer = setTimeout(() => {
        setDisplayText(currentWord.slice(0, displayText.length + 1))
      }, 100)
    }

    return () => clearTimeout(timer)
  }, [currentWordIndex, displayText, words])

  return (
    <>
      {displayText}
      <span className="pulse-animate">|</span>
    </>
  )
}

export default TypingEffect
