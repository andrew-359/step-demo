const RU_PHONE_DIGITS_LENGTH = 11

/** Оставляет только цифры российского номера: 7 + до 10 цифр. */
export function parseRuPhoneDigits(input: string): string {
  let digits = input.replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  if (digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  } else if (!digits.startsWith('7')) {
    digits = `7${digits}`
  }

  return digits.slice(0, RU_PHONE_DIGITS_LENGTH)
}

/** Форматирует номер как +7 (XXX) XXX-XX-XX. */
export function formatRuPhone(input: string): string {
  const digits = parseRuPhoneDigits(input)

  if (!digits) {
    return ''
  }

  const national = digits.slice(1)
  let result = '+7'

  if (national.length > 0) {
    result += ` (${national.slice(0, 3)}`
  }

  if (national.length >= 3) {
    result += ')'
  }

  if (national.length > 3) {
    result += ` ${national.slice(3, 6)}`
  }

  if (national.length > 6) {
    result += `-${national.slice(6, 8)}`
  }

  if (national.length > 8) {
    result += `-${national.slice(8, 10)}`
  }

  return result
}
