import express, { Application } from 'express';
import { LoanRepository } from './loanRepository';

export function createApp(repository: LoanRepository): Application {
  const app = express();

  app.get('/loans/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({ error: 'Invalid loan id' });
      return;
    }

    const loan = repository.findById(id);

    if (!loan) {
      res.status(404).json({ error: 'Loan not found' });
      return;
    }

    res.status(200).json(loan);
  });

  return app;
}
