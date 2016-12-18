package org.igov.service.business.action.task.listener.doc;

import java.util.HashMap;
import java.util.Map;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.Expression;
import org.activiti.engine.delegate.TaskListener;

import static org.igov.service.business.action.task.core.AbstractModelTask.getStringFromFieldExpression;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import org.igov.service.business.process.ProcessSubjectService;

/**
 *
 * @author Kovilin
 */
@Component("SetTasks")
public class SetTasks implements TaskListener {

    private final static org.slf4j.Logger LOG = LoggerFactory.getLogger(SetTasks.class);

    private Expression sTaskProcessDefinition;    
    private Expression sID_Attachment;
    private Expression sTypeDoc;
    private Expression sID_Order_GovPublic;
    private Expression sDateRegistration;
    private Expression sDateDoc;
    private Expression sApplicant;
    private Expression nCountAttach;
    private Expression sContent;
    private Expression sNote;
    private Expression asUrgently;
    private Expression sAutorResolution;
    private Expression asTypeResolution;
    private Expression sTextResolution;
    private Expression sDateExecution;
    /*private Expression sTextReport;*/
    
    @Autowired
    private ProcessSubjectService processSubjectService;

    @Override
    public void notify(DelegateTask delegateTask) {
        
        LOG.info("SetTasks start..." + delegateTask.getProcessInstanceId());
        
        String sTaskProcessDefinition_Value 
                = getStringFromFieldExpression(this.sTaskProcessDefinition, delegateTask.getExecution());
        String sID_Attachment_Value
                = getStringFromFieldExpression(this.sID_Attachment, delegateTask.getExecution());
        String sContent_Value
                = getStringFromFieldExpression(this.sContent, delegateTask.getExecution());
        /*
        
        String sTypeDoc_Value
                = getStringFromFieldExpression(this.sTypeDoc, delegateTask.getExecution());
        String sID_Order_GovPublic_Value
                = getStringFromFieldExpression(this.sID_Order_GovPublic, delegateTask.getExecution());*/
        
        String sDateRegistration_Value
                = getStringFromFieldExpression(this.sDateRegistration, delegateTask.getExecution());
        String sAutorResolution_Value
                = getStringFromFieldExpression(this.sAutorResolution, delegateTask.getExecution());
        String sDateExecution_Value
                = getStringFromFieldExpression(this.sDateExecution, delegateTask.getExecution());
        String sAsTypeResolution_Value
                = getStringFromFieldExpression(this.asTypeResolution, delegateTask.getExecution());
        String sTextResolution_Value
                = getStringFromFieldExpression(this.sTextResolution, delegateTask.getExecution());
        
        /*String sDateDoc_Value
                = getStringFromFieldExpression(this.sDateDoc, delegateTask.getExecution());
        String sApplicant_Value
                = getStringFromFieldExpression(this.sApplicant, delegateTask.getExecution());
        String snCountAttach_Value
                = getStringFromFieldExpression(this.nCountAttach, delegateTask.getExecution());
        String sNote_Value
                = getStringFromFieldExpression(this.sNote, delegateTask.getExecution());
        String sAsUrgently_Value
                = getStringFromFieldExpression(this.asUrgently, delegateTask.getExecution());
        String sTextReport_Value
                = getStringFromFieldExpression(this.sTextReport, delegateTask.getExecution());*/
                
        Map<String, String> mParam = new HashMap<>();
        
        mParam.put("sTaskProcessDefinition", sTaskProcessDefinition_Value);
        mParam.put("sID_Attachment", sID_Attachment_Value);
        mParam.put("sContent", sContent_Value);
        //mParam.put("sTypeDoc", sTypeDoc_Value);
        //mParam.put("sID_Order_GovPublic", sID_Order_GovPublic_Value);
        mParam.put("sDateRegistration", sDateRegistration_Value);
        mParam.put("sAutorResolution", sAutorResolution_Value);
        mParam.put("sDateExecution", sDateExecution_Value);
        mParam.put("asTypeResolution", sAsTypeResolution_Value);
        mParam.put("sTextResolution", sTextResolution_Value);
        
        //mParam.put("sDateDoc", sDateDoc_Value);
        //mParam.put("sApplicant", sApplicant_Value);
        //mParam.put("nCountAttach", snCountAttach_Value);
        //mParam.put("sNote", sNote_Value);
        //mParam.put("asUrgently", sAsUrgently_Value);

        //mParam.put("sTextReport", sTextReport_Value);
        
        /*processSubjectService.setProcessSubjects(sTaskProcessDefinition_Value, sID_Attachment_Value, sContent_Value, 
                sAutorResolution_Value, sTextResolution_Value, sDateExecution_Value, delegateTask.getExecution().getId());*/
        LOG.info("SetTasks start with param..." + mParam);
        processSubjectService.setProcessSubjects(mParam, delegateTask.getExecution().getId());
                
        LOG.info("SetTasks finished");
    }
}