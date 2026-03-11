import { render, screen } from '@testing-library/react'
import { ScrollReveal } from '../scroll-reveal'

describe('ScrollReveal', () => {
  it('renders children', () => {
    render(
      <ScrollReveal>
        <span data-testid="child">hello</span>
      </ScrollReveal>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('accepts variant prop', () => {
    const { container } = render(
      <ScrollReveal variant="slideLeft">
        <span>hello</span>
      </ScrollReveal>
    )
    expect(container.firstChild).toBeTruthy()
  })

  it('accepts delay and duration props', () => {
    const { container } = render(
      <ScrollReveal delay={0.5} duration={1}>
        <span>hello</span>
      </ScrollReveal>
    )
    expect(container.firstChild).toBeTruthy()
  })
})
