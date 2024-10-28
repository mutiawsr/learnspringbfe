package com.ls.learnspringbfe.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/transaction")
public class TransactionController {

    @GetMapping("")
    public ModelAndView transaction() {
        ModelAndView view = new ModelAndView("transaction/index");
        view.addObject("title", "Transaction Data");
        return view;
    }

    @GetMapping("/paymentForm")
    public ModelAndView paymentForm() {
        ModelAndView view = new ModelAndView();
        return view;
    }

    @GetMapping("/orderModal")
    public ModelAndView orderModal() {
        ModelAndView view = new ModelAndView();
        return view;
    }

    @GetMapping("/successForm")
    public ModelAndView successForm() {
        ModelAndView view = new ModelAndView();
        return view;
    }

}
