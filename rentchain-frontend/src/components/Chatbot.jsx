import React, { useState, useRef, useEffect } from 'react';
import {
  Fab,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Slide,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your RentChain assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: input,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, userMessage]);
      setInput('');

      // Simulate bot response
      setTimeout(() => {
        const botResponse = getBotResponse(input);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: botResponse,
          sender: 'bot',
          timestamp: new Date(),
        }]);
      }, 1000);
    }
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    if (input.includes('rent') || input.includes('lease')) {
      return "I can help you with rental agreements! You can list properties, deploy smart contracts, or view your dashboard. What would you like to do?";
    } else if (input.includes('property') || input.includes('listing')) {
      return "Browse our property listings to find your perfect rental. Each property has detailed information and blockchain-backed agreements.";
    } else if (input.includes('deploy') || input.includes('contract')) {
      return "Deploying a rental agreement creates a smart contract on the blockchain. Make sure all details are correct before deployment!";
    } else if (input.includes('help') || input.includes('support')) {
      return "I'm here to help! You can ask about rentals, properties, contracts, or navigate the app. What do you need assistance with?";
    } else {
      return "I'm still learning! For now, I can help with rental-related questions. Try asking about properties, agreements, or navigation.";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Fab
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            boxShadow: theme.shadows[8],
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <ChatIcon />
        </Fab>
      </motion.div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: isMobile ? 0 : 2,
            height: isMobile ? '100%' : '600px',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: theme.palette.primary.main,
            color: 'white',
            p: 2,
          }}
        >
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'white', color: theme.palette.primary.main, mr: 1 }}>
              <ChatIcon />
            </Avatar>
            <Typography variant="h6">RentChain Assistant</Typography>
          </Box>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: theme.palette.grey[50],
            }}
          >
            <List>
              {messages.map((message) => (
                <ListItem
                  key={message.id}
                  sx={{
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 1,
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      bgcolor: message.sender === 'user' ? theme.palette.primary.main : 'white',
                      color: message.sender === 'user' ? 'white' : 'inherit',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2">{message.text}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 0.5,
                        color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary,
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}
            </List>
            <div ref={messagesEndRef} />
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'white',
            }}
          >
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleSend}
                disabled={!input.trim()}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;