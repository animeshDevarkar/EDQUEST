import React, { useState } from 'react';
import styled from 'styled-components';
import { Send, CheckCircle2, AlertCircle, Mail, User, MessageSquare } from 'lucide-react';

const FormContainer = styled.section`
  background-color: ${(props) => props.theme.cardBg};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: ${(props) => props.theme.shadow};
  margin-bottom: 4rem;
`;

const FormHeader = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto 2.5rem;
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-column: ${(props) => (props.$fullWidth ? '1 / -1' : 'span 1')};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: ${(props) => props.theme.textSecondary};
  pointer-events: none;
  display: flex;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.75rem;
  border-radius: 0.75rem;
  border: 2px solid ${(props) => (props.$hasError ? '#ef4444' : props.theme.border)};
  background-color: ${(props) => (props.theme.mode === 'light' ? '#f8fafc' : '#0f172a')};
  color: ${(props) => props.theme.text};
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${(props) => (props.$hasError ? '#ef4444' : props.theme.primary)};
    box-shadow: 0 0 0 4px ${(props) => (props.$hasError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)')};
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.75rem;
  border-radius: 0.75rem;
  border: 2px solid ${(props) => (props.$hasError ? '#ef4444' : props.theme.border)};
  background-color: ${(props) => (props.theme.mode === 'light' ? '#f8fafc' : '#0f172a')};
  color: ${(props) => props.theme.text};
  font-size: 0.95rem;
  font-family: inherit;
  min-height: 120px;
  resize: vertical;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${(props) => (props.$hasError ? '#ef4444' : props.theme.primary)};
    box-shadow: 0 0 0 4px ${(props) => (props.$hasError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)')};
  }
`;

const ErrorMsg = styled.span`
  font-size: 0.8rem;
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
`;

const SubmitButton = styled.button`
  grid-column: 1 / -1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.9rem 2rem;
  background-color: ${(props) => props.theme.primary};
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
  }
`;

export default function ContactForm({ theme }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.message.trim()) newErrors.message = 'Message cannot be empty';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <FormContainer id="contact" theme={theme}>
      <FormHeader>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: theme.text, letterSpacing: '-0.02em' }}>
          UI/UX Interactive Form
        </h2>
        <p style={{ color: theme.textSecondary, marginTop: '0.5rem' }}>
          Demonstrating accessible form styling, focus rings, state validation indicators, and responsive input grid.
        </p>
      </FormHeader>

      {submitted ? (
        <div style={{
          backgroundColor: '#dcfce7',
          color: '#166534',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          textAlign: 'center',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem'
        }}>
          <CheckCircle2 size={24} /> Form submitted successfully with styled feedback!
        </div>
      ) : (
        <FormGrid onSubmit={handleSubmit}>
          <FormGroup theme={theme}>
            <Label theme={theme}>Your Name</Label>
            <InputWrapper>
              <InputIcon theme={theme}><User size={18} /></InputIcon>
              <StyledInput
                theme={theme}
                type="text"
                placeholder="John Doe"
                value={formData.name}
                $hasError={!!errors.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </InputWrapper>
            {errors.name && <ErrorMsg><AlertCircle size={14} /> {errors.name}</ErrorMsg>}
          </FormGroup>

          <FormGroup theme={theme}>
            <Label theme={theme}>Email Address</Label>
            <InputWrapper>
              <InputIcon theme={theme}><Mail size={18} /></InputIcon>
              <StyledInput
                theme={theme}
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                $hasError={!!errors.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </InputWrapper>
            {errors.email && <ErrorMsg><AlertCircle size={14} /> {errors.email}</ErrorMsg>}
          </FormGroup>

          <FormGroup $fullWidth theme={theme}>
            <Label theme={theme}>Message</Label>
            <InputWrapper>
              <InputIcon style={{ top: '1.1rem' }} theme={theme}><MessageSquare size={18} /></InputIcon>
              <StyledTextArea
                theme={theme}
                placeholder="Write your message here..."
                value={formData.message}
                $hasError={!!errors.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </InputWrapper>
            {errors.message && <ErrorMsg><AlertCircle size={14} /> {errors.message}</ErrorMsg>}
          </FormGroup>

          <SubmitButton type="submit" theme={theme}>
            <Send size={18} /> Submit Styled Form
          </SubmitButton>
        </FormGrid>
      )}
    </FormContainer>
  );
}
